import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api, {
  AboutData,
  BootcampMediaData,
  CarouselData,
  CTAData,
  HeroData,
  HighlightData,
  PhaseData,
  RoleData,
  resolveAssetUrl,
} from '../api';
import { defaultSiteContent, normalizeSiteContent } from '../siteContent';

type UploadState = Record<number, boolean>;

const initialHero: HeroData = {
  title: '',
  subtitle: '',
  tagline: '',
  primaryButtonText: '',
  primaryButtonLink: '',
  secondaryButtonText: '',
  secondaryButtonLink: '',
};

const initialAbout: AboutData = {
  whoWeAre: '',
  whyAtlasia: '',
  approach: '',
  vision: '',
  mission: '',
};

const initialCta: CTAData = {
  heading: '',
  buttonText: '',
  buttonLink: '',
};

const isObjectId = (value?: string) => Boolean(value && /^[a-fA-F0-9]{24}$/.test(value));
const errorMessage = (err: unknown) => axios.isAxiosError(err)
  ? (err.response?.data?.error || err.message)
  : (err as Error).message;

const toArray = <T,>(value: unknown): T[] => (Array.isArray(value) ? value as T[] : []);
const normalizeRoles = (value: unknown): RoleData[] => toArray<RoleData>(value).map((role) => ({
  ...role,
  responsibilities: Array.isArray(role.responsibilities) ? role.responsibilities : [],
}));

export default function Admin() {
  const [adminKeyInput, setAdminKeyInput] = useState('');
  const [adminKey, setAdminKey] = useState(localStorage.getItem('atlasia_admin_key') || '');
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [hero, setHero] = useState<HeroData>(initialHero);
  const [about, setAbout] = useState<AboutData>(initialAbout);
  const [cta, setCta] = useState<CTAData>(initialCta);
  const [highlights, setHighlights] = useState<HighlightData[]>([]);
  const [phases, setPhases] = useState<PhaseData[]>([]);
  const [roles, setRoles] = useState<RoleData[]>([]);
  const [carousel, setCarousel] = useState<CarouselData[]>([]);
  const [bootcampMedia, setBootcampMedia] = useState<BootcampMediaData[]>([]);
  const [uploading, setUploading] = useState<UploadState>({});
  const [dbConnected, setDbConnected] = useState<boolean | null>(null);
  const [siteContentJson, setSiteContentJson] = useState(JSON.stringify(defaultSiteContent, null, 2));
  const [uploadedAssetUrl, setUploadedAssetUrl] = useState('');

  const loadAll = async () => {
    setLoading(true);
    setStatus('');
    try {
      const [heroRes, aboutRes, ctaRes, highlightsRes, phasesRes, rolesRes, carouselRes, mediaRes, siteContentRes] = await Promise.all([
        api.get('/hero'),
        api.get('/about'),
        api.get('/cta'),
        api.get('/highlights'),
        api.get('/phases'),
        api.get('/roles'),
        api.get('/carousel'),
        api.get('/bootcamp-media'),
        api.get('/site-content'),
      ]);
      setHero(heroRes.data || initialHero);
      setAbout(aboutRes.data || initialAbout);
      setCta(ctaRes.data || initialCta);
      setHighlights(toArray<HighlightData>(highlightsRes.data));
      setPhases(toArray<PhaseData>(phasesRes.data));
      setRoles(normalizeRoles(rolesRes.data));
      setCarousel(toArray<CarouselData>(carouselRes.data));
      setBootcampMedia(toArray<BootcampMediaData>(mediaRes.data));
      setSiteContentJson(JSON.stringify(normalizeSiteContent(siteContentRes.data), null, 2));
    } catch (err) {
      setStatus(`Load failed: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const verifyAndLoad = async () => {
      if (!adminKey) {
        setLoading(false);
        setAuthorized(false);
        return;
      }
      try {
        await api.get('/admin/verify', { headers: { 'x-admin-key': adminKey } });
        const statusRes = await api.get('/admin/status', { headers: { 'x-admin-key': adminKey } });
        setDbConnected(Boolean(statusRes.data?.dbConnected));
        setAuthorized(true);
        await loadAll();
      } catch (err) {
        localStorage.removeItem('atlasia_admin_key');
        setAdminKey('');
        setAuthorized(false);
        setStatus('Admin verification failed');
        setLoading(false);
      }
    };
    verifyAndLoad();
  }, [adminKey]);

  const adminConfig = () => ({ headers: { 'x-admin-key': adminKey } });

  const login = async () => {
    try {
      await api.get('/admin/verify', { headers: { 'x-admin-key': adminKeyInput } });
      localStorage.setItem('atlasia_admin_key', adminKeyInput);
      setAdminKey(adminKeyInput);
      setAdminKeyInput('');
      setStatus('');
    } catch (err) {
      setStatus('Invalid admin key');
    }
  };

  const logout = () => {
    localStorage.removeItem('atlasia_admin_key');
    setAdminKey('');
    setAuthorized(false);
    setStatus('Logged out');
  };

  const saveSingleton = async (path: string, payload: unknown, label: string) => {
    try {
      await api.put(path, payload, adminConfig());
      setStatus(`${label} saved`);
    } catch (err) {
      setStatus(`Failed to save ${label.toLowerCase()}: ${errorMessage(err)}`);
    }
  };

  const saveListItem = async (
    item: HighlightData | PhaseData | RoleData | CarouselData | BootcampMediaData,
    resource: 'highlights' | 'phases' | 'roles' | 'carousel' | 'bootcamp-media',
  ) => {
    try {
      if (resource === 'roles') {
        const role = item as RoleData;
        if (!role.roleName?.trim() || !role.description?.trim() || !role.registerLink?.trim()) {
          setStatus('Role requires Role Name, Description, and Register Link');
          return;
        }
      }
      if (resource === 'bootcamp-media') {
        const media = item as BootcampMediaData;
        if (!media.mediaUrl) {
          setStatus('Upload a photo or video before saving this media item');
          return;
        }
      }
      if (resource === 'carousel' && !('imageUrl' in item && item.imageUrl)) {
        setStatus('Upload an image before saving this item');
        return;
      }
      if (item._id) {
        if (resource === 'carousel') {
          const payload = { ...item };
          delete (payload as { _id?: string })._id;
          if (isObjectId(item._id)) await api.delete(`/carousel/${item._id}`, adminConfig());
          await api.post('/carousel', payload, adminConfig());
        } else if (dbConnected && !isObjectId(item._id)) {
          const payload = { ...item };
          delete (payload as { _id?: string })._id;
          await api.post(`/${resource}`, payload, adminConfig());
        } else {
          await api.put(`/${resource}/${item._id}`, item, adminConfig());
        }
      } else {
        await api.post(`/${resource}`, item, adminConfig());
      }
      await loadAll();
      setStatus(`${resource} updated`);
    } catch (err) {
      setStatus(`Failed to save ${resource}: ${errorMessage(err)}`);
    }
  };

  const deleteListItem = async (id: string | undefined, resource: 'highlights' | 'phases' | 'roles' | 'carousel' | 'bootcamp-media') => {
    if (!id) return;
    try {
      await api.delete(`/${resource}/${id}`, adminConfig());
      await loadAll();
      setStatus(`${resource} item deleted`);
    } catch (err) {
      setStatus(`Failed to delete ${resource} item: ${errorMessage(err)}`);
    }
  };

  const fileToDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Image read failed'));
      reader.readAsDataURL(file);
    });

  const uploadCarouselImage = async (idx: number, file: File) => {
    setUploading(prev => ({ ...prev, [idx]: true }));
    try {
      const dataUrl = await fileToDataUrl(file);
      const res = await api.post('/uploads/base64', { dataUrl, filename: file.name }, adminConfig());
      const next = [...carousel];
      next[idx] = { ...next[idx], imageUrl: resolveAssetUrl(res.data.url) };
      setCarousel(next);
      setStatus('Image uploaded. Save this carousel item to persist.');
    } catch (err) {
      setStatus(`Upload failed: ${errorMessage(err)}`);
    } finally {
      setUploading(prev => ({ ...prev, [idx]: false }));
    }
  };

  const uploadBootcampMedia = async (idx: number, file: File) => {
    setUploading(prev => ({ ...prev, [1000 + idx]: true }));
    try {
      const dataUrl = await fileToDataUrl(file);
      const res = await api.post('/uploads/base64', { dataUrl, filename: file.name }, adminConfig());
      const mediaType: 'image' | 'video' = file.type.startsWith('video/') ? 'video' : 'image';
      const next = [...bootcampMedia];
      next[idx] = { ...next[idx], mediaUrl: resolveAssetUrl(res.data.url), mediaType };
      setBootcampMedia(next);
      setStatus('Media uploaded. Save this media item to persist.');
    } catch (err) {
      setStatus(`Upload failed: ${errorMessage(err)}`);
    } finally {
      setUploading(prev => ({ ...prev, [1000 + idx]: false }));
    }
  };

  const saveSiteContent = async () => {
    try {
      const parsed = JSON.parse(siteContentJson);
      await api.put('/site-content', parsed, adminConfig());
      setStatus('Site content saved');
    } catch (err) {
      setStatus(`Failed to save site content JSON: ${errorMessage(err)}`);
    }
  };

  const uploadSiteAsset = async (file: File) => {
    try {
      const dataUrl = await fileToDataUrl(file);
      const res = await api.post('/uploads/base64', { dataUrl, filename: file.name }, adminConfig());
      setUploadedAssetUrl(resolveAssetUrl(res.data.url || ''));
      setStatus('Asset uploaded. Paste this URL into Site Content JSON where needed.');
    } catch (err) {
      setStatus(`Asset upload failed: ${errorMessage(err)}`);
    }
  };

  const readSiteContentObject = () => {
    try {
      return normalizeSiteContent(JSON.parse(siteContentJson));
    } catch {
      return normalizeSiteContent(defaultSiteContent);
    }
  };

  const updateAboutImageUrl = (idx: number, url: string) => {
    const parsed = readSiteContentObject();
    const next = [...parsed.aboutPage.sectionImages];
    next[idx] = url;
    const updated = {
      ...parsed,
      aboutPage: {
        ...parsed.aboutPage,
        sectionImages: next,
      },
    };
    setSiteContentJson(JSON.stringify(updated, null, 2));
  };

  const uploadAboutImage = async (idx: number, file: File) => {
    setUploading(prev => ({ ...prev, [2000 + idx]: true }));
    try {
      const dataUrl = await fileToDataUrl(file);
      const res = await api.post('/uploads/base64', { dataUrl, filename: file.name }, adminConfig());
      const url = resolveAssetUrl(res.data.url || '');
      updateAboutImageUrl(idx, url);
      setStatus(`About section ${idx + 1} image uploaded. Save Site Content JSON to publish.`);
    } catch (err) {
      setStatus(`About image upload failed: ${errorMessage(err)}`);
    } finally {
      setUploading(prev => ({ ...prev, [2000 + idx]: false }));
    }
  };

  if (loading) return <div className="pt-28 px-6 max-w-5xl mx-auto">Loading admin...</div>;
  if (!authorized) {
    return (
      <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-xl mx-auto">
        <section className="premium-card space-y-4">
          <h1 className="text-3xl font-display font-bold">Admin Login</h1>
          <p className="text-taupe">Enter your admin key to access this page.</p>
          {status && <div className="p-3 rounded-xl border border-gold/30 bg-gold/10">{status}</div>}
          <Input label="Admin Key" value={adminKeyInput} onChange={setAdminKeyInput} />
          <button className="btn-primary" onClick={login}>Login</button>
        </section>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-10">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-4xl font-display font-bold">Admin Content Manager</h1>
          <p className="text-taupe">Edit content and upload carousel images from this panel.</p>
          {dbConnected !== null && (
            <div className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-medium ${dbConnected ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
              {dbConnected ? 'DB Connected (persistent)' : 'Fallback Mode (temporary)'}
            </div>
          )}
        </div>
        <button className="btn-secondary" onClick={logout}>Logout</button>
      </div>
      {status && <div className="p-4 rounded-xl border border-gold/30 bg-gold/10">{status}</div>}

      <section className="premium-card space-y-3">
        <h2 className="text-2xl font-bold">Hero</h2>
        <Input label="Title" value={hero.title} onChange={(v) => setHero({ ...hero, title: v })} />
        <Input label="Subtitle" value={hero.subtitle} onChange={(v) => setHero({ ...hero, subtitle: v })} />
        <Input label="Tagline" value={hero.tagline} onChange={(v) => setHero({ ...hero, tagline: v })} />
        <Input label="Primary Button Text" value={hero.primaryButtonText} onChange={(v) => setHero({ ...hero, primaryButtonText: v })} />
        <Input label="Primary Button Link" value={hero.primaryButtonLink} onChange={(v) => setHero({ ...hero, primaryButtonLink: v })} />
        <Input label="Secondary Button Text" value={hero.secondaryButtonText} onChange={(v) => setHero({ ...hero, secondaryButtonText: v })} />
        <Input label="Secondary Button Link" value={hero.secondaryButtonLink} onChange={(v) => setHero({ ...hero, secondaryButtonLink: v })} />
        <button className="btn-primary" onClick={() => saveSingleton('/hero', hero, 'Hero')}>Save Hero</button>
      </section>

      <section className="premium-card space-y-3">
        <h2 className="text-2xl font-bold">About</h2>
        <TextArea label="Who We Are" value={about.whoWeAre} onChange={(v) => setAbout({ ...about, whoWeAre: v })} />
        <TextArea label="Why ATLASIA" value={about.whyAtlasia} onChange={(v) => setAbout({ ...about, whyAtlasia: v })} />
        <TextArea label="Approach" value={about.approach} onChange={(v) => setAbout({ ...about, approach: v })} />
        <TextArea label="Vision" value={about.vision} onChange={(v) => setAbout({ ...about, vision: v })} />
        <TextArea label="Mission" value={about.mission} onChange={(v) => setAbout({ ...about, mission: v })} />
        <button className="btn-primary" onClick={() => saveSingleton('/about', about, 'About')}>Save About</button>
      </section>

      <section className="premium-card space-y-3">
        <h2 className="text-2xl font-bold">CTA</h2>
        <Input label="Heading" value={cta.heading} onChange={(v) => setCta({ ...cta, heading: v })} />
        <Input label="Button Text" value={cta.buttonText} onChange={(v) => setCta({ ...cta, buttonText: v })} />
        <Input label="Button Link" value={cta.buttonLink} onChange={(v) => setCta({ ...cta, buttonLink: v })} />
        <button className="btn-primary" onClick={() => saveSingleton('/cta', cta, 'CTA')}>Save CTA</button>
      </section>

      <section className="premium-card space-y-3">
        <h2 className="text-2xl font-bold">Global Site Content</h2>
        <p className="text-sm text-taupe">This JSON controls all page-level static headings, subtitles, footer text, and non-collection content.</p>
        <label className="block text-sm font-medium text-mocha/80">Upload Asset (for image URLs used in JSON)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) uploadSiteAsset(file);
          }}
        />
        {uploadedAssetUrl && (
          <div className="space-y-2">
            <Input label="Uploaded Asset URL" value={uploadedAssetUrl} onChange={setUploadedAssetUrl} />
            <button
              className="btn-secondary"
              onClick={() => navigator.clipboard?.writeText(uploadedAssetUrl)}
            >
              Copy URL
            </button>
          </div>
        )}
        <TextArea label="Site Content JSON" value={siteContentJson} onChange={setSiteContentJson} />
        <button className="btn-primary" onClick={saveSiteContent}>Save Site Content JSON</button>
      </section>

      <section className="premium-card space-y-4">
        <h2 className="text-2xl font-bold">About Section Images</h2>
        <p className="text-sm text-taupe">Upload one image per About section. These replace old default placeholders.</p>
        {readSiteContentObject().aboutPage.sectionTitles.map((title, idx) => {
          const imageUrl = readSiteContentObject().aboutPage.sectionImages[idx] || '';
          return (
            <div key={`${title}-${idx}`} className="border border-black/10 rounded-2xl p-4 space-y-3">
              <p className="font-medium">{title || `Section ${idx + 1}`}</p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadAboutImage(idx, file);
                }}
              />
              {uploading[2000 + idx] && <p className="text-sm text-taupe">Uploading...</p>}
              <Input
                label="Image URL"
                value={imageUrl}
                onChange={(v) => updateAboutImageUrl(idx, v)}
              />
              {imageUrl ? (
                <img src={resolveAssetUrl(imageUrl)} alt={`${title} preview`} className="w-56 h-36 object-cover rounded-xl border border-black/10" />
              ) : (
                <p className="text-sm text-taupe">No image set.</p>
              )}
            </div>
          );
        })}
        <button className="btn-primary" onClick={saveSiteContent}>Save About Images</button>
      </section>

      <ListEditor<HighlightData>
        title="Highlights"
        addLabel="Add Highlight"
        items={highlights}
        setItems={setHighlights}
        render={(item, onChange) => (
          <>
            <Input label="Title" value={item.title} onChange={(v) => onChange({ ...item, title: v })} />
            <TextArea label="Description" value={item.description} onChange={(v) => onChange({ ...item, description: v })} />
            <Input label="Order" value={String(item.order || 1)} onChange={(v) => onChange({ ...item, order: Number(v) || 1 })} />
          </>
        )}
        onAdd={() => setHighlights(prev => [...prev, { title: '', description: '', order: prev.length + 1 }])}
        onSave={(item) => saveListItem(item, 'highlights')}
        onDelete={(item) => deleteListItem(item._id, 'highlights')}
      />

      <ListEditor<PhaseData>
        title="Phases"
        addLabel="Add Phase"
        items={phases}
        setItems={setPhases}
        render={(item, onChange) => (
          <>
            <Input label="Title" value={item.title} onChange={(v) => onChange({ ...item, title: v })} />
            <Input label="Duration" value={item.duration} onChange={(v) => onChange({ ...item, duration: v })} />
            <TextArea label="Description" value={item.description} onChange={(v) => onChange({ ...item, description: v })} />
            <Input label="Order" value={String(item.order || 1)} onChange={(v) => onChange({ ...item, order: Number(v) || 1 })} />
          </>
        )}
        onAdd={() => setPhases(prev => [...prev, { title: '', duration: '', description: '', order: prev.length + 1 }])}
        onSave={(item) => saveListItem(item, 'phases')}
        onDelete={(item) => deleteListItem(item._id, 'phases')}
      />

      <ListEditor<RoleData>
        title="Roles"
        addLabel="Add Role"
        items={roles}
        setItems={setRoles}
        render={(item, onChange) => (
          <>
            <Input label="Role Name" value={item.roleName} onChange={(v) => onChange({ ...item, roleName: v })} />
            <TextArea label="Description" value={item.description} onChange={(v) => onChange({ ...item, description: v })} />
            <Input
              label="Responsibilities (comma separated)"
              value={(item.responsibilities || []).join(', ')}
              onChange={(v) => onChange({ ...item, responsibilities: v.split(',').map(x => x.trim()).filter(Boolean) })}
            />
            <Input label="Register Link" value={item.registerLink} onChange={(v) => onChange({ ...item, registerLink: v })} />
            <Input label="Order" value={String(item.order || 1)} onChange={(v) => onChange({ ...item, order: Number(v) || 1 })} />
          </>
        )}
        onAdd={() => setRoles(prev => [...prev, { roleName: '', description: '', responsibilities: [], registerLink: '', order: prev.length + 1 }])}
        onSave={(item) => saveListItem(item, 'roles')}
        onDelete={(item) => deleteListItem(item._id, 'roles')}
      />

      <ListEditor<CarouselData>
        title="Carousel"
        addLabel="Add Carousel Item"
        items={carousel}
        setItems={setCarousel}
        render={(item, onChange, idx) => (
          <>
            <Input label="Title" value={item.title} onChange={(v) => onChange({ ...item, title: v })} />
            <TextArea label="Description" value={item.description} onChange={(v) => onChange({ ...item, description: v })} />
            <label className="block text-sm font-medium text-mocha/80">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadCarouselImage(idx, file);
              }}
            />
            {uploading[idx] && <p className="text-sm text-taupe">Uploading...</p>}
            {!item.imageUrl && <p className="text-sm text-red-700">No image uploaded yet.</p>}
            {item.imageUrl && <img src={resolveAssetUrl(item.imageUrl)} alt="preview" className="w-48 h-28 object-cover rounded-xl border border-black/10" />}
          </>
        )}
        onAdd={() => setCarousel(prev => [...prev, { title: '', description: '', imageUrl: '' }])}
        onSave={(item) => saveListItem(item, 'carousel')}
        onDelete={(item) => deleteListItem(item._id, 'carousel')}
      />

      <ListEditor<BootcampMediaData>
        title="Bootcamp Media Carousel"
        addLabel="Add Media Slide"
        items={bootcampMedia}
        setItems={setBootcampMedia}
        render={(item, onChange, idx) => (
          <>
            <Input label="Title" value={item.title} onChange={(v) => onChange({ ...item, title: v })} />
            <TextArea label="Description" value={item.description} onChange={(v) => onChange({ ...item, description: v })} />
            <Input label="Media Type (image/video)" value={item.mediaType} onChange={(v) => onChange({ ...item, mediaType: v === 'video' ? 'video' : 'image' })} />
            <Input label="Order" value={String(item.order || 1)} onChange={(v) => onChange({ ...item, order: Number(v) || 1 })} />
            <label className="block text-sm font-medium text-mocha/80">Upload Photo or Video</label>
            <input
              type="file"
              accept="image/*,video/mp4,video/webm,video/ogg"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadBootcampMedia(idx, file);
              }}
            />
            {uploading[1000 + idx] && <p className="text-sm text-taupe">Uploading...</p>}
            {!item.mediaUrl && <p className="text-sm text-red-700">No media uploaded yet.</p>}
            {item.mediaUrl && item.mediaType === 'image' && <img src={resolveAssetUrl(item.mediaUrl)} alt="preview" className="w-56 h-36 object-cover rounded-xl border border-black/10" />}
            {item.mediaUrl && item.mediaType === 'video' && <video src={resolveAssetUrl(item.mediaUrl)} className="w-56 h-36 object-cover rounded-xl border border-black/10" controls />}
          </>
        )}
        onAdd={() => setBootcampMedia(prev => [...prev, { title: '', description: '', mediaUrl: '', mediaType: 'image', order: prev.length + 1 }])}
        onSave={(item) => saveListItem(item, 'bootcamp-media')}
        onDelete={(item) => deleteListItem(item._id, 'bootcamp-media')}
      />
    </div>
  );
}

function ListEditor<T extends { _id?: string }>({
  title,
  addLabel,
  items,
  setItems,
  render,
  onAdd,
  onSave,
  onDelete,
}: {
  title: string;
  addLabel: string;
  items: T[];
  setItems: React.Dispatch<React.SetStateAction<T[]>>;
  render: (item: T, onChange: (next: T) => void, idx: number) => React.ReactNode;
  onAdd: () => void;
  onSave: (item: T) => void;
  onDelete: (item: T) => void;
}) {
  return (
    <section className="premium-card space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{title}</h2>
        <button className="btn-secondary" onClick={onAdd}>{addLabel}</button>
      </div>
      {items.map((item, idx) => (
        <div key={item._id || `${title}-${idx}`} className="border border-black/10 rounded-2xl p-4 space-y-3">
          {render(item, (next) => {
            const copy = [...items];
            copy[idx] = next;
            setItems(copy);
          }, idx)}
          <div className="flex gap-3">
            <button className="btn-primary" onClick={() => onSave(item)}>Save Item</button>
            {item._id && <button className="btn-secondary" onClick={() => onDelete(item)}>Delete</button>}
          </div>
        </div>
      ))}
      {items.length === 0 && <p className="text-taupe">No items yet.</p>}
    </section>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-mocha/80">{label}</span>
      <input
        className="w-full rounded-xl border border-black/10 px-4 py-2 bg-white"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-mocha/80">{label}</span>
      <textarea
        className="w-full rounded-xl border border-black/10 px-4 py-2 bg-white min-h-24"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

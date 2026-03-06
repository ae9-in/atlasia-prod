import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import api, { PhaseData, RoleData, CTAData, BootcampMediaData, resolveAssetUrl } from '../api';
import { LoadingScreen, SectionTitle } from '../components/Common';
import { Link } from 'react-router-dom';
import { CheckCircle2, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { SiteContent, defaultSiteContent, normalizeSiteContent } from '../siteContent';

const fallbackPhases: PhaseData[] = [
  { _id: 'ph1', title: 'Phase 1: Foundations', duration: 'Day 1-3', description: 'Introduction to industry standards and core concepts.', order: 1 },
  { _id: 'ph2', title: 'Phase 2: Deep Dive', duration: 'Day 4-8', description: 'Intensive workshops and real-world case studies.', order: 2 },
  { _id: 'ph3', title: 'Phase 3: Execution', duration: 'Day 9-12', description: 'Final project delivery and corporate presentation.', order: 3 },
];

const fallbackRoles: RoleData[] = [
  { _id: 'r1', roleName: 'Business Analyst', description: 'Analyze business needs and document requirements.', responsibilities: ['Requirement Gathering', 'Process Mapping', 'Stakeholder Management'], registerLink: 'https://docs.google.com/forms/d/e/1FAIpQLSdddFRbl4A_gALPwJRA82ZklQpV1cvrg6FyCYak6Vm27QQoIw/viewform', order: 1 },
  { _id: 'r2', roleName: 'Product Manager', description: 'Drive product vision and strategy.', responsibilities: ['Roadmap Planning', 'User Research', 'Agile Leadership'], registerLink: 'https://docs.google.com/forms/d/e/1FAIpQLSdddFRbl4A_gALPwJRA82ZklQpV1cvrg6FyCYak6Vm27QQoIw/viewform', order: 2 },
  { _id: 'r3', roleName: 'Operations Lead', description: 'Optimize internal processes and efficiency.', responsibilities: ['Workflow Optimization', 'Resource Allocation', 'Performance Tracking'], registerLink: 'https://docs.google.com/forms/d/e/1FAIpQLSdddFRbl4A_gALPwJRA82ZklQpV1cvrg6FyCYak6Vm27QQoIw/viewform', order: 3 },
];

const fallbackMediaSlides: BootcampMediaData[] = [
  { _id: 'bm1', mediaUrl: '/uploads/1772621960511-ca0f63a4-9b35-460a-92d8-8b357c30963f-WhatsAppImage2026-03-04at42501PM1.jpg', mediaType: 'image', title: 'Bootcamp Media 1', description: 'Auto-loaded from uploads folder.', order: 1 },
  { _id: 'bm2', mediaUrl: '/uploads/1772621926796-9a0523a7-823c-4b5b-9f7a-50715da0b0fd-WhatsAppImage2026-03-04at42501PM.jpg', mediaType: 'image', title: 'Bootcamp Media 2', description: 'Auto-loaded from uploads folder.', order: 2 },
  { _id: 'bm3', mediaUrl: '/uploads/1772621907273-f43b9b5a-9059-457b-b2c2-b24f2ab20b0a-WhatsAppImage2026-03-04at42502PM.jpg', mediaType: 'image', title: 'Bootcamp Media 3', description: 'Auto-loaded from uploads folder.', order: 3 },
  { _id: 'bm4', mediaUrl: '/uploads/1772621899573-7dc370ec-66e7-4e5b-8110-c7e2e25690f3-WhatsAppImage2026-03-04at42501PM2.jpg', mediaType: 'image', title: 'Bootcamp Media 4', description: 'Auto-loaded from uploads folder.', order: 4 },
];

const fallbackCta: CTAData = {
  heading: 'Ready to Transform Your Career?',
  buttonText: 'Register Now',
  buttonLink: '/students',
};

const toArray = <T,>(value: unknown, fallback: T[]): T[] => (
  Array.isArray(value) ? value as T[] : fallback
);

const normalizeRoles = (value: unknown): RoleData[] => {
  const roles = toArray<RoleData>(value, fallbackRoles);
  return roles.map((role) => ({
    ...role,
    responsibilities: Array.isArray(role.responsibilities) ? role.responsibilities : [],
  }));
};

export default function Bootcamp() {
  const [loading, setLoading] = useState(true);
  const [phases, setPhases] = useState<PhaseData[]>(fallbackPhases);
  const [roles, setRoles] = useState<RoleData[]>(fallbackRoles);
  const [mediaSlides, setMediaSlides] = useState<BootcampMediaData[]>(fallbackMediaSlides);
  const [activeSlide, setActiveSlide] = useState(0);
  const [cta, setCta] = useState<CTAData>(fallbackCta);
  const [siteContent, setSiteContent] = useState<SiteContent>(defaultSiteContent);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [phasesRes, rolesRes, ctaRes, mediaRes, siteContentRes] = await Promise.all([
          api.get('/phases'),
          api.get('/roles'),
          api.get('/cta'),
          api.get('/bootcamp-media'),
          api.get('/site-content'),
        ]);
        setPhases(toArray<PhaseData>(phasesRes.data, fallbackPhases));
        setRoles(normalizeRoles(rolesRes.data));
        setCta(ctaRes.data && typeof ctaRes.data === 'object' ? ctaRes.data : fallbackCta);
        setMediaSlides(toArray<BootcampMediaData>(mediaRes.data, fallbackMediaSlides));
        setSiteContent(normalizeSiteContent(siteContentRes.data));
      } catch (err) {
        console.error(err);
        setPhases(fallbackPhases);
        setRoles(fallbackRoles);
        setCta(fallbackCta);
        setMediaSlides(fallbackMediaSlides);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!mediaSlides.length) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % mediaSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [mediaSlides]);

  useEffect(() => {
    if (!mediaSlides.length) {
      setActiveSlide(0);
      return;
    }
    if (activeSlide >= mediaSlides.length) {
      setActiveSlide(0);
    }
  }, [mediaSlides.length, activeSlide]);

  if (loading) return <LoadingScreen />;

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-24 bg-mocha text-ivory relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold via-transparent to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-display font-bold mb-6"
          >
            {siteContent.bootcampPage.heroTitle}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-ivory/70 max-w-3xl mx-auto"
          >
            {siteContent.bootcampPage.heroSubtitle}
          </motion.p>
        </div>
      </section>

      {/* Testimonials (Media Carousel) */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title={siteContent.bootcampPage.testimonialsTitle} subtitle={siteContent.bootcampPage.testimonialsSubtitle} />
          {mediaSlides.length > 0 ? (
            <div className="relative max-w-4xl mx-auto">
              <div className="premium-card p-6 md:p-8">
                <div className="relative rounded-2xl overflow-hidden bg-black/5 mb-6">
                  {mediaSlides[activeSlide].mediaType === 'video' ? (
                    <video
                      src={resolveAssetUrl(mediaSlides[activeSlide].mediaUrl)}
                      className="w-full h-[420px] object-cover"
                      controls
                      playsInline
                    />
                  ) : (
                    <img
                      src={resolveAssetUrl(mediaSlides[activeSlide].mediaUrl)}
                      alt={mediaSlides[activeSlide].title || `Bootcamp media ${activeSlide + 1}`}
                      className="w-full h-[420px] object-cover"
                      referrerPolicy="no-referrer"
                    />
                  )}
                </div>
                <h4 className="text-2xl font-display font-bold text-mocha mb-2 text-center">{mediaSlides[activeSlide].title}</h4>
                <p className="text-taupe text-center">{mediaSlides[activeSlide].description}</p>
              </div>

              <button
                onClick={() => setActiveSlide((prev) => (prev - 1 + mediaSlides.length) % mediaSlides.length)}
                className="absolute left-0 md:-left-16 top-1/2 -translate-y-1/2 p-3 rounded-full bg-mocha text-ivory hover:bg-taupe transition-colors"
                aria-label="Previous slide"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => setActiveSlide((prev) => (prev + 1) % mediaSlides.length)}
                className="absolute right-0 md:-right-16 top-1/2 -translate-y-1/2 p-3 rounded-full bg-mocha text-ivory hover:bg-taupe transition-colors"
                aria-label="Next slide"
              >
                <ChevronRight size={20} />
              </button>

              <div className="mt-8 flex justify-center gap-2">
                {mediaSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSlide(idx)}
                    className={`h-2 rounded-full transition-all ${idx === activeSlide ? 'w-8 bg-gold' : 'w-2 bg-mocha/30'}`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <p className="text-center text-taupe">No media yet.</p>
          )}
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title={siteContent.bootcampPage.timelineTitle} subtitle={siteContent.bootcampPage.timelineSubtitle} />

          <div className="relative">
            {/* Vertical Line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gold/30 -translate-x-1/2" />

            <div className="space-y-16">
              {phases.map((phase, idx) => (
                <motion.div
                  key={phase._id || idx}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className={`flex flex-col md:flex-row items-center gap-8 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  <div className="flex-1 text-center md:text-right">
                    <div className={`md:pr-12 ${idx % 2 === 0 ? '' : 'md:pr-0 md:pl-12 md:text-left'}`}>
                      <span className="text-gold font-heading text-sm uppercase tracking-widest mb-2 block">{phase.duration}</span>
                      <h3 className="text-3xl font-display font-bold mb-4 text-mocha">{phase.title}</h3>
                      <p className="text-taupe leading-relaxed">{phase.description}</p>
                    </div>
                  </div>

                  <div className="relative z-10 w-12 h-12 rounded-full bg-mocha border-4 border-ivory flex items-center justify-center text-gold font-bold">
                    {idx + 1}
                  </div>

                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Role Breakdown */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title={siteContent.bootcampPage.roleBreakdownTitle} subtitle={siteContent.bootcampPage.roleBreakdownSubtitle} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {roles.map((role, idx) => (
              <div key={role._id || idx} className="premium-card flex flex-col">
                <h3 className="text-2xl font-display font-bold mb-4 text-mocha">{role.roleName}</h3>
                <p className="text-taupe mb-8 flex-grow">{role.description}</p>

                <div className="mb-8">
                  <h4 className="text-sm font-heading uppercase tracking-widest text-gold mb-4">Responsibilities</h4>
                  <ul className="space-y-3">
                    {role.responsibilities.map((resp, i) => (
                      <li key={i} className="flex items-start space-x-3 text-sm text-taupe">
                        <CheckCircle2 size={16} className="text-gold mt-0.5 shrink-0" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href={role.registerLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full text-center flex items-center justify-center"
                >
                  {siteContent.bootcampPage.roleRegisterText} <ExternalLink size={16} className="ml-2" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section className="py-24 bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-mocha rounded-[3rem] p-12 md:p-20 text-ivory relative overflow-hidden">
            <div className="relative z-10">
              <SectionTitle title={siteContent.bootcampPage.outcomesTitle} subtitle={siteContent.bootcampPage.outcomesSubtitle} light />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
                <div className="space-y-8">
                  <div className="flex items-start space-x-6">
                    <div className="w-12 h-12 rounded-2xl bg-gold/20 flex items-center justify-center text-gold shrink-0">1</div>
                    <div>
                      <h4 className="text-xl font-display font-bold mb-2">{siteContent.bootcampPage.outcomes[0]?.title}</h4>
                      <p className="text-ivory/60">{siteContent.bootcampPage.outcomes[0]?.description}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-6">
                    <div className="w-12 h-12 rounded-2xl bg-gold/20 flex items-center justify-center text-gold shrink-0">2</div>
                    <div>
                      <h4 className="text-xl font-display font-bold mb-2">{siteContent.bootcampPage.outcomes[1]?.title}</h4>
                      <p className="text-ivory/60">{siteContent.bootcampPage.outcomes[1]?.description}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-8">
                  <div className="flex items-start space-x-6">
                    <div className="w-12 h-12 rounded-2xl bg-gold/20 flex items-center justify-center text-gold shrink-0">3</div>
                    <div>
                      <h4 className="text-xl font-display font-bold mb-2">{siteContent.bootcampPage.outcomes[2]?.title}</h4>
                      <p className="text-ivory/60">{siteContent.bootcampPage.outcomes[2]?.description}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-6">
                    <div className="w-12 h-12 rounded-2xl bg-gold/20 flex items-center justify-center text-gold shrink-0">4</div>
                    <div>
                      <h4 className="text-xl font-display font-bold mb-2">{siteContent.bootcampPage.outcomes[3]?.title}</h4>
                      <p className="text-ivory/60">{siteContent.bootcampPage.outcomes[3]?.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-display font-bold text-mocha mb-8">{cta.heading}</h2>
          <Link to={cta.buttonLink || '/'} className="btn-primary text-xl px-12 py-4">
            {cta.buttonText}
          </Link>
        </div>
      </section>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import api, { HeroData, HighlightData, CarouselData, PhaseData, RoleData, CTAData } from '../api';
import { LoadingScreen, SectionTitle } from '../components/Common';
import { Carousel } from '../components/Carousel';
import { ChevronRight, ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SiteContent, defaultSiteContent, normalizeSiteContent } from '../siteContent';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [hero, setHero] = useState<HeroData | null>(null);
  const [highlights, setHighlights] = useState<HighlightData[]>([]);
  const [carousel, setCarousel] = useState<CarouselData[]>([]);
  const [phases, setPhases] = useState<PhaseData[]>([]);
  const [roles, setRoles] = useState<RoleData[]>([]);
  const [cta, setCta] = useState<CTAData | null>(null);
  const [siteContent, setSiteContent] = useState<SiteContent>(defaultSiteContent);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [heroRes, highlightsRes, carouselRes, phasesRes, rolesRes, ctaRes, siteContentRes] = await Promise.all([
          api.get('/hero'),
          api.get('/highlights'),
          api.get('/carousel'),
          api.get('/phases'),
          api.get('/roles'),
          api.get('/cta'),
          api.get('/site-content'),
        ]);
        setHero(heroRes.data);
        setHighlights(highlightsRes.data);
        setCarousel(carouselRes.data);
        setPhases(phasesRes.data.slice(0, 3));
        setRoles(rolesRes.data);
        setCta(ctaRes.data);
        setSiteContent(normalizeSiteContent(siteContentRes.data));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-mocha/5 via-ivory to-gold/5" />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/4 -left-20 w-96 h-96 bg-gold/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              x: [0, -40, 0],
              y: [0, -60, 0],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-1/4 -right-20 w-[30rem] h-[30rem] bg-mocha/5 rounded-full blur-3xl"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-gold font-heading text-sm uppercase tracking-[0.4em] mb-6 block">
              {hero?.subtitle}
            </span>
            <h1 className="text-7xl md:text-9xl font-display font-bold text-mocha mb-8 tracking-tighter leading-none">
              {hero?.title}
            </h1>
            <p className="text-xl md:text-2xl text-taupe max-w-3xl mx-auto mb-12 leading-relaxed font-light">
              {hero?.tagline}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to={hero?.primaryButtonLink || '/'} className="btn-primary flex items-center group">
                {hero?.primaryButtonText}
                <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to={hero?.secondaryButtonLink || '/'} className="btn-secondary">
                {hero?.secondaryButtonText}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Carousel Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title={siteContent.home.carouselTitle} subtitle={siteContent.home.carouselSubtitle} />
          <Carousel items={carousel} />
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-24 bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title={siteContent.home.highlightsTitle} subtitle={siteContent.home.highlightsSubtitle} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {highlights.map((item, idx) => (
              <motion.div
                key={item._id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="premium-card"
              >
                <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center text-gold mb-6">
                  <span className="text-xl font-bold">{idx + 1}</span>
                </div>
                <h3 className="text-2xl font-display font-bold mb-4">{item.title}</h3>
                <p className="text-taupe leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bootcamp Preview */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16">
            <div className="max-w-2xl">
              <SectionTitle title={siteContent.home.bootcampJourneyTitle} subtitle={siteContent.home.bootcampJourneySubtitle} />
            </div>
            <Link to="/bootcamp" className="mb-16 text-gold font-medium flex items-center hover:underline group">
              {siteContent.home.bootcampTimelineLinkText} <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {phases.map((phase, idx) => (
              <div key={phase._id || idx} className="relative">
                <div className="text-gold font-heading text-xs uppercase tracking-widest mb-4">{phase.duration}</div>
                <h4 className="text-2xl font-display font-bold mb-4">{phase.title}</h4>
                <p className="text-taupe">{phase.description}</p>
                {idx < phases.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-6 w-12 h-px bg-gold/20" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles Preview */}
      <section className="py-24 bg-mocha text-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title={siteContent.home.rolesTitle} subtitle={siteContent.home.rolesSubtitle} light />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {roles.map((role, idx) => (
              <div key={role._id || idx} className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors">
                <h3 className="text-2xl font-display font-bold mb-4 text-gold">{role.roleName}</h3>
                <p className="text-ivory/70 mb-8 line-clamp-3">{role.description}</p>
                <a
                  href={role.registerLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-ivory font-medium hover:text-gold transition-colors"
                >
                  {siteContent.home.roleRegisterText} <ExternalLink size={16} className="ml-2" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-display font-bold text-mocha mb-8">
              {cta?.heading}
            </h2>
            <Link to={cta?.buttonLink || '/'} className="btn-primary text-xl px-12 py-4">
              {cta?.buttonText}
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

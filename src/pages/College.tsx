import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import api from '../api';
import { LoadingScreen, SectionTitle } from '../components/Common';
import { SiteContent, defaultSiteContent, normalizeSiteContent } from '../siteContent';
import { Building2, GraduationCap, Handshake, CheckCircle2, ArrowRight } from 'lucide-react';

export default function College() {
  const [loading, setLoading] = useState(true);
  const [siteContent, setSiteContent] = useState<SiteContent>(defaultSiteContent);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const siteContentRes = await api.get('/site-content');
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

  const benefits = siteContent.collegePage.benefits || [];
  const processSteps = siteContent.collegePage.processSteps || [];

  return (
    <div className="pt-20">
      <section className="py-24 bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <SectionTitle title={siteContent.collegePage.heroTitle} subtitle={siteContent.collegePage.heroSubtitle} />
            <a
              href={siteContent.collegePage.heroRegisterLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-xl px-12 py-4 inline-flex items-center"
            >
              {siteContent.collegePage.heroRegisterText}
              <ArrowRight size={18} className="ml-2" />
            </a>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title={siteContent.collegePage.whyPartnerTitle} subtitle={siteContent.collegePage.whyPartnerSubtitle} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, idx) => {
              const icon = idx === 0 ? <GraduationCap size={30} /> : idx === 1 ? <Handshake size={30} /> : <Building2 size={30} />;
              return (
                <motion.div
                  key={`${benefit.title}-${idx}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className="premium-card"
                >
                  <div className="w-14 h-14 bg-gold/10 rounded-2xl flex items-center justify-center text-gold mb-6">
                    {icon}
                  </div>
                  <h3 className="text-2xl font-display font-bold mb-4 text-mocha">{benefit.title}</h3>
                  <p className="text-taupe leading-relaxed">{benefit.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 bg-mocha text-ivory">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title={siteContent.collegePage.processTitle} light />
          <div className="space-y-5">
            {processSteps.map((step, idx) => (
              <div key={`${step}-${idx}`} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-gold text-mocha font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </div>
                <p className="text-ivory/85 leading-relaxed">{step}</p>
                <CheckCircle2 size={18} className="text-gold ml-auto shrink-0 mt-1" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gold">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-display font-bold text-mocha mb-8">
            {siteContent.collegePage.finalHeading}
          </h2>
          <a
            href={siteContent.collegePage.finalRegisterLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-xl px-12 py-4 inline-flex items-center"
          >
            {siteContent.collegePage.finalRegisterText}
            <ArrowRight size={18} className="ml-2" />
          </a>
        </div>
      </section>
    </div>
  );
}

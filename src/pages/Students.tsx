import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import api, { CTAData, resolveAssetUrl } from '../api';
import { LoadingScreen, SectionTitle } from '../components/Common';
import { GraduationCap, Briefcase, Rocket, CheckCircle2 } from 'lucide-react';
import { SiteContent, defaultSiteContent, normalizeSiteContent } from '../siteContent';

export default function Students() {
  const [loading, setLoading] = useState(true);
  const [cta, setCta] = useState<CTAData | null>(null);
  const [siteContent, setSiteContent] = useState<SiteContent>(defaultSiteContent);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ctaRes, siteContentRes] = await Promise.all([
          api.get('/cta'),
          api.get('/site-content'),
        ]);
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

  const benefits = [
    {
      icon: <GraduationCap size={32} />,
      title: siteContent.studentsPage.benefits[0]?.title || "Real-World Experience",
      description: siteContent.studentsPage.benefits[0]?.description || "Move beyond theory and work on actual industry projects."
    },
    {
      icon: <Briefcase size={32} />,
      title: siteContent.studentsPage.benefits[1]?.title || "Corporate Networking",
      description: siteContent.studentsPage.benefits[1]?.description || "Connect with leaders from top global companies."
    },
    {
      icon: <Rocket size={32} />,
      title: siteContent.studentsPage.benefits[2]?.title || "Career Acceleration",
      description: siteContent.studentsPage.benefits[2]?.description || "Gain the skills that employers are actually looking for."
    }
  ];

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-24 bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <SectionTitle
              title={siteContent.studentsPage.heroTitle}
              subtitle={siteContent.studentsPage.heroSubtitle}
            />
            <div className="flex justify-center mt-8">
              <a href={siteContent.studentsPage.heroRegisterLink} target="_blank" rel="noopener noreferrer" className="btn-primary text-xl px-12 py-4">
                {siteContent.studentsPage.heroRegisterText}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Join */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title={siteContent.studentsPage.whyJoinTitle} subtitle={siteContent.studentsPage.whyJoinSubtitle} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {benefits.map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-gold/10 rounded-3xl flex items-center justify-center text-gold mx-auto mb-8">
                  {benefit.icon}
                </div>
                <h3 className="text-2xl font-display font-bold mb-4 text-mocha">{benefit.title}</h3>
                <p className="text-taupe leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="py-24 bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="flex-1">
              <h2 className="text-4xl font-display font-bold mb-8 text-mocha">{siteContent.studentsPage.experienceTitle}</h2>
              <div className="space-y-6">
                {siteContent.studentsPage.experienceItems.map((item, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <CheckCircle2 className="text-gold" size={24} />
                    <span className="text-lg text-taupe">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="aspect-square bg-mocha/5 rounded-[3rem] overflow-hidden">
                <img
                  src={resolveAssetUrl(siteContent.studentsPage.experienceImageUrl)}
                  alt="Student Experience"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-gold p-8 rounded-3xl shadow-xl">
                <p className="text-mocha font-display font-bold text-2xl">{siteContent.studentsPage.experienceBadgeText}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-mocha text-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-8">{cta?.heading}</h2>
          <a href={siteContent.studentsPage.finalRegisterLink} target="_blank" rel="noopener noreferrer" className="btn-primary !bg-gold !text-mocha">
            {siteContent.studentsPage.finalRegisterText || cta?.buttonText}
          </a>
        </div>
      </section>
    </div>
  );
}

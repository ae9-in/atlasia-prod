import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import api, { AboutData, CTAData, resolveAssetUrl } from '../api';
import { LoadingScreen, SectionTitle } from '../components/Common';
import { Link } from 'react-router-dom';
import { SiteContent, defaultSiteContent, normalizeSiteContent } from '../siteContent';

const aboutDefaults: AboutData = {
  whoWeAre: "Atlasia is a premier industry immersion bootcamp designed to bridge the gap between academic learning and corporate reality.",
  whyAtlasia: "We provide real-world exposure, mentorship from industry leaders, and hands-on project experience.",
  approach: "Our 12-day intensive program focuses on execution, strategy, and professional growth.",
  vision: "To be a leader in professional immersion training for students",
  mission: "Empowering the next generation of professionals through direct industry engagement.",
};

// Code-level About page image fallbacks.
// You can use external URLs or local served paths like /uploads/<file-name>.
const aboutCodeImageUrls: string[] = [
  "https://res.cloudinary.com/dt7hm4udv/image/upload/ChatGPT_Image_Mar_5_2026_10_38_18_PM_htofli.png",
  "https://res.cloudinary.com/dt7hm4udv/image/upload/ChatGPT_Image_Mar_5_2026_10_46_31_PM_wigrkf.png",
  "https://res.cloudinary.com/dt7hm4udv/image/upload/WhatsApp_Image_2026-03-06_at_9.24.49_AM_wu3cfs.jpg",
  "https://res.cloudinary.com/dt7hm4udv/image/upload/WhatsApp_Image_2026-03-04_at_4.25.01_PM_noctge.jpg",
  "https://res.cloudinary.com/dt7hm4udv/image/upload/WhatsApp_Image_2026-03-04_at_4.25.01_PM_1_h4nt6d.jpg",
];

export default function About() {
  const [loading, setLoading] = useState(true);
  const [about, setAbout] = useState<AboutData | null>(null);
  const [cta, setCta] = useState<CTAData | null>(null);
  const [siteContent, setSiteContent] = useState<SiteContent>(defaultSiteContent);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aboutRes, ctaRes, siteContentRes] = await Promise.all([
          api.get('/about'),
          api.get('/cta'),
          api.get('/site-content'),
        ]);
        setAbout(aboutRes.data);
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

  const sections = [
    { title: siteContent.aboutPage.sectionTitles[0] || "Who We Are", content: about?.whoWeAre || aboutDefaults.whoWeAre, image: siteContent.aboutPage.sectionImages[0] || aboutCodeImageUrls[0] },
    { title: siteContent.aboutPage.sectionTitles[1] || "Why ATLASIA", content: about?.whyAtlasia || aboutDefaults.whyAtlasia, image: siteContent.aboutPage.sectionImages[1] || aboutCodeImageUrls[1] },
    { title: siteContent.aboutPage.sectionTitles[2] || "Our Approach", content: about?.approach || aboutDefaults.approach, image: siteContent.aboutPage.sectionImages[2] || aboutCodeImageUrls[2] },
    { title: siteContent.aboutPage.sectionTitles[3] || "Our Vision", content: about?.vision || aboutDefaults.vision, image: siteContent.aboutPage.sectionImages[3] || aboutCodeImageUrls[3] },
    { title: siteContent.aboutPage.sectionTitles[4] || "Our Mission", content: about?.mission || aboutDefaults.mission, image: siteContent.aboutPage.sectionImages[4] || aboutCodeImageUrls[4] },
  ];

  return (
    <div className="pt-20">
      <section className="py-24 bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title={siteContent.aboutPage.pageTitle} subtitle={siteContent.aboutPage.pageSubtitle} />

          <div className="space-y-24">
            {sections.map((section, idx) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-center`}
              >
                <div className="flex-1">
                  <h3 className="text-3xl font-display font-bold mb-6 text-mocha">{section.title}</h3>
                  <div className="gold-divider w-24 !my-6" />
                  <p className="text-xl text-taupe leading-relaxed font-light">
                    {section.content}
                  </p>
                </div>
                <div className="flex-1 w-full h-80 bg-mocha/5 rounded-[2rem] overflow-hidden">
                  {section.image ? (
                    <img
                      src={resolveAssetUrl(section.image)}
                      alt={section.title}
                      className="w-full h-full object-cover opacity-80"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-mocha/50 text-sm font-medium">
                      Upload image from Admin panel
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-mocha text-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-8">{cta?.heading}</h2>
          <Link to={cta?.buttonLink || '/'} className="btn-primary !bg-gold !text-mocha">
            {cta?.buttonText}
          </Link>
        </div>
      </section>
    </div>
  );
}

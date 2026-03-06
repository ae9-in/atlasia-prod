import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Mail, Phone } from 'lucide-react';
import api from '../api';
import { SiteContent, defaultSiteContent, normalizeSiteContent } from '../siteContent';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [siteContent, setSiteContent] = useState<SiteContent>(defaultSiteContent);
  const location = useLocation();

  useEffect(() => {
    api.get('/site-content')
      .then((res) => setSiteContent(normalizeSiteContent(res.data)))
      .catch(() => setSiteContent(defaultSiteContent));
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Bootcamp', path: '/bootcamp' },
    { name: 'Students', path: '/students' },
  ];

  return (
    <nav className="glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-display font-bold tracking-tighter text-mocha">{siteContent.common.brandName}</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-gold ${
                  location.pathname === link.path ? 'text-gold' : 'text-mocha/70'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link to="/students" className="btn-primary text-sm py-2 px-6">
              {siteContent.common.navRegisterText}
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-mocha hover:text-gold transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-ivory border-t border-gold/10 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-4 text-base font-medium ${
                    location.pathname === link.path ? 'text-gold' : 'text-mocha/70'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4">
                <Link
                  to="/students"
                  onClick={() => setIsOpen(false)}
                  className="btn-primary block text-center"
                >
                  {siteContent.common.navRegisterNowText}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export const Footer = () => {
  const [siteContent, setSiteContent] = useState<SiteContent>(defaultSiteContent);

  useEffect(() => {
    api.get('/site-content')
      .then((res) => setSiteContent(normalizeSiteContent(res.data)))
      .catch(() => setSiteContent(defaultSiteContent));
  }, []);

  return (
    <footer className="bg-mocha text-ivory pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-3xl font-display font-bold mb-6">{siteContent.common.brandName}</h3>
            <p className="text-ivory/60 max-w-md leading-relaxed">
              {siteContent.common.footerDescription}
            </p>
          </div>

          <div>
            <h4 className="text-gold font-heading text-sm uppercase tracking-widest mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link to="/" className="text-ivory/70 hover:text-ivory transition-colors">Home</Link></li>
              <li><Link to="/about" className="text-ivory/70 hover:text-ivory transition-colors">About Us</Link></li>
              <li><Link to="/bootcamp" className="text-ivory/70 hover:text-ivory transition-colors">Bootcamp</Link></li>
              <li><Link to="/students" className="text-ivory/70 hover:text-ivory transition-colors">Students</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-gold font-heading text-sm uppercase tracking-widest mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3 text-ivory/70">
                <Mail size={18} className="text-gold" />
                <a
                  href={`mailto:${siteContent.common.footerEmail}`}
                  className="hover:text-ivory transition-colors underline-offset-2 hover:underline"
                >
                  {siteContent.common.footerEmail}
                </a>
              </li>
              <li className="flex items-center space-x-3 text-ivory/70">
                <Phone size={18} className="text-gold" />
                <span>{siteContent.common.footerPhone}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-ivory/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-ivory/40">
          <p>&copy; {new Date().getFullYear()} {siteContent.common.brandName}. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-ivory transition-colors">{siteContent.common.footerPrivacyText}</a>
            <a href="#" className="hover:text-ivory transition-colors">{siteContent.common.footerTermsText}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export const LoadingScreen = () => (
  <div className="fixed inset-0 bg-ivory flex items-center justify-center z-[100]">
    <motion.div
      animate={{
        scale: [1, 1.1, 1],
        opacity: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="text-4xl font-display font-bold text-mocha tracking-widest"
    >
      ATLASIA
    </motion.div>
  </div>
);

export const SectionTitle = ({ title, subtitle, light = false }: { title: string; subtitle?: string; light?: boolean }) => (
  <div className="mb-16 text-center">
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`text-4xl md:text-5xl font-display font-bold mb-4 ${light ? 'text-ivory' : 'text-mocha'}`}
    >
      {title}
    </motion.h2>
    {subtitle && (
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className={`text-lg max-w-2xl mx-auto ${light ? 'text-ivory/70' : 'text-taupe'}`}
      >
        {subtitle}
      </motion.p>
    )}
    <div className="mt-6 flex justify-center">
      <div className="h-1 w-20 bg-gold rounded-full" />
    </div>
  </div>
);

export interface SiteContent {
  common: {
    brandName: string;
    navRegisterText: string;
    navRegisterNowText: string;
    footerDescription: string;
    footerEmail: string;
    footerPhone: string;
    footerPrivacyText: string;
    footerTermsText: string;
  };
  home: {
    carouselTitle: string;
    carouselSubtitle: string;
    highlightsTitle: string;
    highlightsSubtitle: string;
    bootcampJourneyTitle: string;
    bootcampJourneySubtitle: string;
    bootcampTimelineLinkText: string;
    rolesTitle: string;
    rolesSubtitle: string;
    roleRegisterText: string;
  };
  aboutPage: {
    pageTitle: string;
    pageSubtitle: string;
    sectionTitles: string[];
    sectionImages: string[];
  };
  bootcampPage: {
    heroTitle: string;
    heroSubtitle: string;
    testimonialsTitle: string;
    testimonialsSubtitle: string;
    timelineTitle: string;
    timelineSubtitle: string;
    roleBreakdownTitle: string;
    roleBreakdownSubtitle: string;
    roleRegisterText: string;
    outcomesTitle: string;
    outcomesSubtitle: string;
    outcomes: Array<{ title: string; description: string }>;
  };
  studentsPage: {
    heroTitle: string;
    heroSubtitle: string;
    heroRegisterText: string;
    heroRegisterLink: string;
    whyJoinTitle: string;
    whyJoinSubtitle: string;
    benefits: Array<{ title: string; description: string }>;
    experienceTitle: string;
    experienceItems: string[];
    experienceImageUrl: string;
    experienceBadgeText: string;
    finalRegisterLink: string;
    finalRegisterText: string;
  };
}

export const defaultSiteContent: SiteContent = {
  common: {
    brandName: "ATLASIA",
    navRegisterText: "Register",
    navRegisterNowText: "Register Now",
    footerDescription: "The Bootcamp Company. Bridging the gap between classroom learning and corporate execution through intensive industry immersion.",
    footerEmail: "hello@atlasia.com",
    footerPhone: "+1 (555) 000-0000",
    footerPrivacyText: "Privacy Policy",
    footerTermsText: "Terms of Service",
  },
  home: {
    carouselTitle: "Experience the Immersion",
    carouselSubtitle: "A glimpse into the life at ATLASIA bootcamp.",
    highlightsTitle: "Why Choose Us",
    highlightsSubtitle: "We provide more than just education; we provide a career launchpad.",
    bootcampJourneyTitle: "Bootcamp Journey",
    bootcampJourneySubtitle: "A structured path from classroom to corporate execution.",
    bootcampTimelineLinkText: "View Full Timeline",
    rolesTitle: "Available Roles",
    rolesSubtitle: "Find the perfect fit for your career aspirations.",
    roleRegisterText: "Register for this role",
  },
  aboutPage: {
    pageTitle: "About ATLASIA",
    pageSubtitle: "Learn about our journey and the impact we create.",
    sectionTitles: ["Who We Are", "Why ATLASIA", "Our Approach", "Our Vision", "Our Mission"],
    sectionImages: [
      "",
      "",
      "",
      "",
      "",
    ],
  },
  bootcampPage: {
    heroTitle: "The 15-Day Journey",
    heroSubtitle: "A rigorous, high-impact immersion program designed to transform your professional capabilities.",
    testimonialsTitle: "Testimonials",
    testimonialsSubtitle: "Stories from participants who completed the immersion.",
    timelineTitle: "Bootcamp Timeline",
    timelineSubtitle: "Every day is a step closer to corporate excellence.",
    roleBreakdownTitle: "Role Breakdown",
    roleBreakdownSubtitle: "Specialized tracks for diverse professional interests.",
    roleRegisterText: "Register Now",
    outcomesTitle: "Program Outcomes",
    outcomesSubtitle: "What you will achieve by the end of the 15 days.",
    outcomes: [
      { title: "Corporate Readiness", description: "Master the soft skills and professional etiquette required in top-tier corporate environments." },
      { title: "Strategic Thinking", description: "Develop the ability to analyze complex business problems and propose viable solutions." },
      { title: "Execution Excellence", description: "Learn how to take a project from ideation to final delivery with precision and quality." },
      { title: "Industry Network", description: "Build a professional network that will support your career growth for years to come." },
    ],
  },
  studentsPage: {
    heroTitle: "For the Next Generation",
    heroSubtitle: "Are you ready to bridge the gap between classroom and corporate?",
    heroRegisterText: "Register Now",
    heroRegisterLink: "https://docs.google.com/forms/d/e/1FAIpQLSdSpFlEDLjvojJoACj1gMSSBU6Zspk5yYafi79CGh-IBQ4uVg/viewform",
    whyJoinTitle: "Why Join ATLASIA?",
    whyJoinSubtitle: "We empower students with the tools for success.",
    benefits: [
      { title: "Real-World Experience", description: "Move beyond theory and work on actual industry projects." },
      { title: "Corporate Networking", description: "Connect with leaders from top global companies." },
      { title: "Career Acceleration", description: "Gain the skills that employers are actually looking for." },
    ],
    experienceTitle: "What You Will Experience",
    experienceItems: [
      "Intensive 15-day corporate immersion",
      "Direct mentorship from industry veterans",
      "Hands-on project execution",
      "Professional etiquette and soft skills training",
      "Final presentation to corporate leaders",
    ],
    experienceImageUrl: "https://picsum.photos/seed/students/800/800",
    experienceBadgeText: "100% Immersion",
    finalRegisterLink: "https://docs.google.com/forms/d/e/1FAIpQLSdSpFlEDLjvojJoACj1gMSSBU6Zspk5yYafi79CGh-IBQ4uVg/viewform",
    finalRegisterText: "Register Now",
  },
};

export function normalizeSiteContent(raw: unknown): SiteContent {
  const src = (raw && typeof raw === "object" ? raw : {}) as Partial<SiteContent>;
  return {
    common: { ...defaultSiteContent.common, ...(src.common || {}) },
    home: { ...defaultSiteContent.home, ...(src.home || {}) },
    aboutPage: {
      ...defaultSiteContent.aboutPage,
      ...(src.aboutPage || {}),
      sectionTitles: Array.isArray(src.aboutPage?.sectionTitles) ? src.aboutPage.sectionTitles : defaultSiteContent.aboutPage.sectionTitles,
      sectionImages: Array.isArray(src.aboutPage?.sectionImages) ? src.aboutPage.sectionImages : defaultSiteContent.aboutPage.sectionImages,
    },
    bootcampPage: {
      ...defaultSiteContent.bootcampPage,
      ...(src.bootcampPage || {}),
      outcomes: Array.isArray(src.bootcampPage?.outcomes) ? src.bootcampPage.outcomes : defaultSiteContent.bootcampPage.outcomes,
    },
    studentsPage: {
      ...defaultSiteContent.studentsPage,
      ...(src.studentsPage || {}),
      benefits: Array.isArray(src.studentsPage?.benefits) ? src.studentsPage.benefits : defaultSiteContent.studentsPage.benefits,
      experienceItems: Array.isArray(src.studentsPage?.experienceItems) ? src.studentsPage.experienceItems : defaultSiteContent.studentsPage.experienceItems,
    },
  };
}

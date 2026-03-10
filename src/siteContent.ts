export interface SiteContent {
  common: {
    brandName: string;
    navRegisterText: string;
    navRegisterLink: string;
    navRegisterNowText: string;
    navRegisterNowLink: string;
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
    joinCarouselTitle: string;
    joinCarouselSubtitle: string;
    joinCarouselSlides: Array<{
      eyebrow: string;
      headline: string;
      body: string;
      stat: string;
      ctaText: string;
      ctaLink: string;
    }>;
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
  collegePage: {
    heroTitle: string;
    heroSubtitle: string;
    heroRegisterText: string;
    heroRegisterLink: string;
    whyPartnerTitle: string;
    whyPartnerSubtitle: string;
    benefits: Array<{ title: string; description: string }>;
    processTitle: string;
    processSteps: string[];
    finalHeading: string;
    finalRegisterText: string;
    finalRegisterLink: string;
  };
}

export const defaultSiteContent: SiteContent = {
  common: {
    brandName: "ATLASIA",
    navRegisterText: "Register",
    navRegisterLink: "/college",
    navRegisterNowText: "Register Now",
    navRegisterNowLink: "/college",
    footerDescription: "The Bootcamp Company. Bridging the gap between classroom learning and corporate execution through intensive industry immersion.",
    footerEmail: "careers@atlasia.online",
    footerPhone: "8431119696",
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
    joinCarouselTitle: "Why Students Choose ATLASIA",
    joinCarouselSubtitle: "A focused immersion that turns classroom confidence into corporate execution.",
    joinCarouselSlides: [
      {
        eyebrow: "Career Outcome",
        headline: "Build a portfolio that recruiters can evaluate in minutes",
        body: "Work on guided real-world tasks and leave with proof of execution, not just attendance.",
        stat: "3 Live project simulations",
        ctaText: "See Bootcamp Plan",
        ctaLink: "/bootcamp",
      },
      {
        eyebrow: "Mentorship Access",
        headline: "Learn directly from mentors who review your work",
        body: "Receive structured feedback on communication, strategy, and execution standards used in companies.",
        stat: "1:1 + group mentor reviews",
        ctaText: "Explore Roles",
        ctaLink: "/students",
      },
      {
        eyebrow: "Placement Readiness",
        headline: "Practice interviews, business communication, and delivery",
        body: "Train for what hiring teams expect in your first weeks on the job: ownership, clarity, and speed.",
        stat: "12-day intensive format",
        ctaText: "Register Now",
        ctaLink: "/students",
      },
    ],
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
    heroTitle: "The 12-Day Journey",
    heroSubtitle: "A rigorous, high-impact immersion program designed to transform your professional capabilities.",
    testimonialsTitle: "Testimonials",
    testimonialsSubtitle: "Stories from participants who completed the immersion.",
    timelineTitle: "Bootcamp Timeline",
    timelineSubtitle: "Every day is a step closer to corporate excellence.",
    roleBreakdownTitle: "Role Breakdown",
    roleBreakdownSubtitle: "Specialized tracks for diverse professional interests.",
    roleRegisterText: "Register Now",
    outcomesTitle: "Program Outcomes",
    outcomesSubtitle: "What you will achieve by the end of the 12 days.",
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
    heroRegisterLink: "https://docs.google.com/forms/d/e/1FAIpQLSdddFRbl4A_gALPwJRA82ZklQpV1cvrg6FyCYak6Vm27QQoIw/viewform",
    whyJoinTitle: "Why Join ATLASIA?",
    whyJoinSubtitle: "We empower students with the tools for success.",
    benefits: [
      { title: "Real-World Experience", description: "Move beyond theory and work on actual industry projects." },
      { title: "Corporate Networking", description: "Connect with leaders from top global companies." },
      { title: "Career Acceleration", description: "Gain the skills that employers are actually looking for." },
    ],
    experienceTitle: "What You Will Experience",
    experienceItems: [
      "Intensive 12-day corporate immersion",
      "Direct mentorship from industry veterans",
      "Hands-on project execution",
      "Professional etiquette and soft skills training",
      "Interview Readiness",
    ],
    experienceImageUrl: "/images/students-workshop.png.png",
    experienceBadgeText: "100% Immersion",
    finalRegisterLink: "https://docs.google.com/forms/d/e/1FAIpQLSdddFRbl4A_gALPwJRA82ZklQpV1cvrg6FyCYak6Vm27QQoIw/viewform",
    finalRegisterText: "Register Now",
  },
  collegePage: {
    heroTitle: "College Partnership Registration",
    heroSubtitle: "Enable your students to access ATLASIA's intensive industry immersion through a structured campus collaboration.",
    heroRegisterText: "Register Your College",
    heroRegisterLink: "https://docs.google.com/forms/d/e/1FAIpQLSdddFRbl4A_gALPwJRA82ZklQpV1cvrg6FyCYak6Vm27QQoIw/viewform",
    whyPartnerTitle: "Why Partner With ATLASIA",
    whyPartnerSubtitle: "A practical bridge between academic curriculum and corporate execution readiness.",
    benefits: [
      { title: "Placement-Ready Students", description: "Students train on real execution workflows expected by modern employers." },
      { title: "Industry Mentor Network", description: "Your campus gets access to experts leading live sessions and reviews." },
      { title: "Structured Execution Framework", description: "A repeatable collaboration model for multiple student cohorts." },
    ],
    processTitle: "How College Registration Works",
    processSteps: [
      "Submit your college registration details through the form.",
      "Our team connects with your placement/training coordinator.",
      "We align schedules, cohort size, and role tracks.",
      "Launch your campus immersion batch with ATLASIA mentors.",
    ],
    finalHeading: "Bring ATLASIA Immersion to Your Campus",
    finalRegisterText: "Start College Registration",
    finalRegisterLink: "https://docs.google.com/forms/d/e/1FAIpQLSdddFRbl4A_gALPwJRA82ZklQpV1cvrg6FyCYak6Vm27QQoIw/viewform",
  },
};

export function normalizeSiteContent(raw: unknown): SiteContent {
  const src = (raw && typeof raw === "object" ? raw : {}) as Partial<SiteContent>;
  return {
    common: { ...defaultSiteContent.common, ...(src.common || {}) },
    home: {
      ...defaultSiteContent.home,
      ...(src.home || {}),
      joinCarouselSlides: Array.isArray(src.home?.joinCarouselSlides)
        ? src.home.joinCarouselSlides
        : defaultSiteContent.home.joinCarouselSlides,
    },
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
    collegePage: {
      ...defaultSiteContent.collegePage,
      ...(src.collegePage || {}),
      benefits: Array.isArray(src.collegePage?.benefits) ? src.collegePage.benefits : defaultSiteContent.collegePage.benefits,
      processSteps: Array.isArray(src.collegePage?.processSteps) ? src.collegePage.processSteps : defaultSiteContent.collegePage.processSteps,
    },
  };
}

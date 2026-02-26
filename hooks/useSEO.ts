// SEO Hook for React Components
import { useEffect } from 'react';
import { seoService } from '../services/seoService';
import { SeoMetadata } from '../services/seoService';

export const useSEO = (endpoint: string, title?: string) => {
  useEffect(() => {
    const initializeSEO = async () => {
      await seoService.initializePage(endpoint);
      if (title) {
        seoService.trackPageView(window.location.pathname, title);
      }
    };

    initializeSEO();
  }, [endpoint, title]);
};

export const useSEOUpdate = () => {
  const updateMetadata = (metadata: SeoMetadata) => {
    seoService.updateMetadata(metadata);
  };

  const trackPageView = (page: string, title?: string) => {
    seoService.trackPageView(page, title);
  };

  const generateBreadcrumbs = (breadcrumbs: Array<{ name: string; url: string }>) => {
    seoService.generateBreadcrumbs(breadcrumbs);
  };

  return {
    updateMetadata,
    trackPageView,
    generateBreadcrumbs
  };
};

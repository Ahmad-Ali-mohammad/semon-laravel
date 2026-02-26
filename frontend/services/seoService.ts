// SEO Service for Frontend
export interface SeoMetadata {
  title: string;
  description: string;
  keywords: string;
  canonical: string;
  robots: string;
  'og:title'?: string;
  'og:description'?: string;
  'og:type'?: string;
  'og:url'?: string;
  'og:image'?: string;
  'twitter:card'?: string;
  'twitter:title'?: string;
  'twitter:description'?: string;
  'twitter:image'?: string;
  'product:price:amount'?: string;
  'product:price:currency'?: string;
  'product:availability'?: string;
  'article:published_time'?: string;
  'article:author'?: string;
}

class SeoService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  }

  /**
   * Fetch SEO metadata from backend
   */
  async fetchSeoData(endpoint: string): Promise<SeoMetadata | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/seo/${endpoint}`);
      if (!response.ok) {
        console.error('Failed to fetch SEO data:', endpoint);
        return null;
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching SEO data:', error);
      return null;
    }
  }

  /**
   * Update page metadata
   */
  updateMetadata(metadata: SeoMetadata): void {
    // Update title
    if (metadata.title) {
      document.title = metadata.title;
    }

    // Update or create meta tags
    this.updateMetaTag('title', metadata.title);
    this.updateMetaTag('description', metadata.description);
    this.updateMetaTag('keywords', metadata.keywords);
    this.updateMetaTag('canonical', metadata.canonical);
    this.updateMetaTag('robots', metadata.robots);

    // Update Open Graph tags
    if (metadata['og:title']) {
      this.updateMetaTag('og:title', metadata['og:title']);
    }
    if (metadata['og:description']) {
      this.updateMetaTag('og:description', metadata['og:description']);
    }
    if (metadata['og:type']) {
      this.updateMetaTag('og:type', metadata['og:type']);
    }
    if (metadata['og:url']) {
      this.updateMetaTag('og:url', metadata['og:url']);
    }
    if (metadata['og:image']) {
      this.updateMetaTag('og:image', metadata['og:image']);
    }

    // Update Twitter Card tags
    if (metadata['twitter:card']) {
      this.updateMetaTag('twitter:card', metadata['twitter:card']);
    }
    if (metadata['twitter:title']) {
      this.updateMetaTag('twitter:title', metadata['twitter:title']);
    }
    if (metadata['twitter:description']) {
      this.updateMetaTag('twitter:description', metadata['twitter:description']);
    }
    if (metadata['twitter:image']) {
      this.updateMetaTag('twitter:image', metadata['twitter:image']);
    }

    // Update structured data
    this.updateStructuredData(metadata);

    // Update product-specific tags
    if (metadata['product:price:amount']) {
      this.updateMetaTag('product:price:amount', metadata['product:price:amount']);
    }
    if (metadata['product:price:currency']) {
      this.updateMetaTag('product:price:currency', metadata['product:price:currency']);
    }
    if (metadata['product:availability']) {
      this.updateMetaTag('product:availability', metadata['product:availability']);
    }

    // Update article-specific tags
    if (metadata['article:published_time']) {
      this.updateMetaTag('article:published_time', metadata['article:published_time']);
    }
    if (metadata['article:author']) {
      this.updateMetaTag('article:author', metadata['article:author']);
    }
  }

  /**
   * Update a single meta tag
   */
  private updateMetaTag(name: string, content: string): void {
    let tag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
    
    if (!tag) {
      tag = document.createElement('meta');
      tag.name = name;
      tag.setAttribute('content', content);
      document.head.appendChild(tag);
    } else {
      tag.setAttribute('content', content);
    }
  }

  /**
   * Update structured data (JSON-LD)
   */
  private updateStructuredData(metadata: SeoMetadata): void {
    // Remove existing structured data
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Create new structured data
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: metadata.title,
      url: metadata.canonical,
      description: metadata.description,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${this.baseUrl}/products?search={search_term}`,
        'query-input': 'required name=search_term'
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
  }

  /**
   * Initialize SEO for a page
   */
  async initializePage(endpoint: string): Promise<void> {
    const metadata = await this.fetchSeoData(endpoint);
    if (metadata) {
      this.updateMetadata(metadata);
    }
  }

  /**
   * Generate breadcrumb structured data
   */
  generateBreadcrumbs(breadcrumbs: Array<{ name: string; url: string }>): string {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': breadcrumbs.map((breadcrumb, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': breadcrumb.name,
        'item': breadcrumb.url
      }))
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
  }

  /**
   * Track page view for analytics
   */
  trackPageView(page: string, title?: string): void {
    // This would typically integrate with Google Analytics or similar
    console.log('Page view tracked:', { page, title });
    
    // Send to analytics service if available
    if (window.gtag) {
      window.gtag('config', 'UA-XXXXXXXXX', {
        page_path: page,
        page_title: title
      });
    }
  }
}

export const seoService = new SeoService();

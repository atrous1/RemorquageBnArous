export interface SeoConfig {
  siteUrl: string;
  googleSiteVerification: string;
  publicRoutes: string[];
  business: {
    name: string;
    description: string;
    telephone: string;
    areaServed: string[];
    address: {
      streetAddress?: string;
      addressLocality?: string;
      postalCode?: string;
      addressCountry: string;
    } | null;
    geo: {
      latitude: number;
      longitude: number;
    } | null;
    sameAs: string[];
  };
}

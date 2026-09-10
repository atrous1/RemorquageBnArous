import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { generatedSeoConfig } from './seo.generated';
import type { SeoConfig } from './seo.types';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly document = inject(DOCUMENT);
  private readonly seoConfig = generatedSeoConfig as SeoConfig;

  constructor() {
    this.configureSeoHead();
  }

  private configureSeoHead(): void {
    const siteUrl = this.seoConfig.siteUrl.replace(/\/$/, '');
    const canonicalUrl = siteUrl ? `${siteUrl}/` : '';
    const imageUrl = siteUrl
      ? `${siteUrl}/assets/images/remorquage-hero.jpg`
      : undefined;

    if (canonicalUrl) {
      this.upsertCanonical(canonicalUrl);
      this.upsertMeta('property', 'og:url', canonicalUrl);

      if (imageUrl) {
        this.upsertMeta('property', 'og:image', imageUrl);
        this.upsertMeta('name', 'twitter:image', imageUrl);
      }
    }

    if (this.seoConfig.googleSiteVerification) {
      this.upsertMeta(
        'name',
        'google-site-verification',
        this.seoConfig.googleSiteVerification,
      );
    }

    this.upsertStructuredData(canonicalUrl, imageUrl);
  }

  private upsertCanonical(url: string): void {
    let canonical = this.document.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );

    if (!canonical) {
      canonical = this.document.createElement('link');
      canonical.rel = 'canonical';
      this.document.head.appendChild(canonical);
    }

    canonical.href = url;
  }

  private upsertMeta(
    attribute: 'name' | 'property',
    key: string,
    content: string,
  ): void {
    let meta = this.document.head.querySelector<HTMLMetaElement>(
      `meta[${attribute}="${key}"]`,
    );

    if (!meta) {
      meta = this.document.createElement('meta');
      meta.setAttribute(attribute, key);
      this.document.head.appendChild(meta);
    }

    meta.content = content;
  }

  private upsertStructuredData(
    canonicalUrl: string,
    imageUrl?: string,
  ): void {
    const business = this.seoConfig.business;
    const structuredData: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'AutomotiveBusiness',
      name: business.name,
      description: business.description,
      telephone: business.telephone,
      areaServed: business.areaServed.map((name) => ({
        '@type': name.startsWith('Péage') ? 'Place' : 'City',
        name,
      })),
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '00:00',
        closes: '23:59',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: business.telephone,
        contactType: 'roadside assistance',
        availableLanguage: ['French', 'Arabic'],
      },
    };

    if (canonicalUrl) {
      structuredData['@id'] = `${canonicalUrl}#business`;
      structuredData['url'] = canonicalUrl;
    }

    if (imageUrl) {
      structuredData['image'] = imageUrl;
    }

    if (business.address) {
      structuredData['address'] = {
        '@type': 'PostalAddress',
        ...business.address,
      };
    }

    if (business.geo) {
      structuredData['geo'] = {
        '@type': 'GeoCoordinates',
        latitude: business.geo.latitude,
        longitude: business.geo.longitude,
      };
    }

    if (business.sameAs.length > 0) {
      structuredData['sameAs'] = business.sameAs;
    }

    let script = this.document.head.querySelector<HTMLScriptElement>(
      '#local-business-schema',
    );

    if (!script) {
      script = this.document.createElement('script');
      script.id = 'local-business-schema';
      script.type = 'application/ld+json';
      this.document.head.appendChild(script);
    }

    script.textContent = JSON.stringify(structuredData);
  }
}

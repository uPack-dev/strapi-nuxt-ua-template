interface SeoImage {
  url?: string;
  alternativeText?: string;
  width?: number;
  height?: number;
}

interface SeoData {
  canonical?: string;
  siteName?: string;
  siteDescription?: string;
  ogImage?: SeoImage;
  ogTitle?: string;
  ogDescription?: string;
  favicon?: SeoImage;
  robots?: string;
}

/**
 * @param data - Page SEO values overriding global defaults.
 * @returns Nothing; registers head links and social metadata.
 * @example useSeo({ siteName: 'Site', robots: 'index, follow' })
 */
export const useSeo = (data: SeoData = {}): void => {
  const globalStore = useGlobalStore();
  const $seoData = globalStore.seoData as SeoData;
  const route = useRoute();
  const {
    public: { siteUrl },
  } = useRuntimeConfig();
  const canonical =
    data?.canonical ||
    (siteUrl ? new URL(route.path, siteUrl).toString() : route.path);

  const seoData = {
    siteName: data?.siteName || $seoData?.siteName,
    description: data?.siteDescription || $seoData?.siteDescription,
    ogImage: data?.ogImage?.url || $seoData?.ogImage?.url,
    ogImageAlt:
      data?.ogImage?.alternativeText || $seoData?.ogImage?.alternativeText,
    ogUrl: canonical,
    ogSiteName: data?.siteName || $seoData?.siteName,
    ogImageWidth: data?.ogImage?.width || $seoData?.ogImage?.width,
    ogImageHeight: data?.ogImage?.height || $seoData?.ogImage?.height,
    ogTitle:
      data?.ogTitle ||
      data?.siteName ||
      $seoData?.ogTitle ||
      $seoData?.siteName,
    ogDescription:
      data?.ogDescription ||
      data?.siteDescription ||
      $seoData?.ogDescription ||
      $seoData?.siteDescription,
    favicon: data?.favicon?.url || $seoData?.favicon?.url,
    canonical,
  };

  useHead({
    link: [
      { rel: 'canonical', href: seoData.canonical },
      { rel: 'icon', type: 'image/png', href: seoData?.favicon },
    ],
  });

  useSeoMeta({
    robots: data?.robots || 'index, follow',
    ogUrl: seoData?.canonical,
    title: seoData?.siteName,
    description: seoData?.description,
    ogImage: seoData?.ogImage,
    ogTitle: seoData?.ogTitle,
    ogDescription: seoData?.ogDescription,
    ogType: 'website',
    ogLocale: 'en_US',
    ogImageAlt: seoData?.ogImageAlt,
    ogSiteName: seoData?.ogSiteName,
    ogImageHeight: seoData?.ogImageHeight,
    ogImageWidth: seoData?.ogImageWidth,
    twitterTitle: seoData?.ogTitle,
    twitterDescription: seoData?.ogDescription,
    twitterCard: 'summary_large_image',
    twitterImage: seoData?.ogImage,
    twitterImageAlt: seoData?.ogImageAlt,
    twitterImageHeight: seoData?.ogImageHeight,
    twitterImageWidth: seoData?.ogImageWidth,
  });
};

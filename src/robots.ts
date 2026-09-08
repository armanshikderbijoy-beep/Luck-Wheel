export type MetadataRouteRobots = {
  rules: {
    userAgent: string | string[];
    allow?: string | string[];
    disallow?: string | string[];
  };
  sitemap?: string;
  host?: string;
};

export default function robots(): MetadataRouteRobots {
  const baseUrl = 'https://wheelspinner.app';
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://syahriza.vercel.app';

  // Daftarkan rute statis atau rute dari tools Anda di sini
  const staticRoutes = [
    '',
    '/about',
    '/projects',
    '/birthday',
    '/valentine',
    '/eid-alfitr',
    '/eid-aladha',
    '/secret-box',
    '/wrapped',
    '/graduation',
    '/qr-generator',
    '/phone-tracker',
    '/vent' // Tautan Ruang Pelepasan & Awan Emosi Anda
  ];

  const sitemapEntries = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: (route === '' ? 'daily' : 'weekly') as 'daily' | 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  return sitemapEntries;
}
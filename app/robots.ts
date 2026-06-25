import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://syahriza.vercel.app';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',       // Jangan biarkan bot merayapi internal API endpoint
        '/_next/',     // Folder aset internal build Next.js
        '/(private)/',     // Jika Anda memiliki dashboard admin rahasia
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
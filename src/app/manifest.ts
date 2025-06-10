import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Takhayul Literary Society GMC',
    short_name: 'TLS GMC',
    description: 'A Progressive Web App for Takhayul Literary Society at Gujranwala Medical College',
    start_url: '/',
    display: 'standalone',
    background_color: '#f3e3e2',
    theme_color: '#1b2e3c',
    icons: [
      {
        src: '/logo.png',
        sizes: '500x500',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/logo-144.png',
        sizes: '144x144',
        type: 'image/png',
      },
    ],
  }
}
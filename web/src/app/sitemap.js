export default function sitemap() {
  const baseUrl = 'https://localhub.pro';
  
  // Standard routes
  const routes = [
    '',
    '/about',
    '/contact',
    '/terms',
    '/privacy',
    '/search',
    '/categories',
    '/login',
    '/register',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'monthly',
    priority: route === '' ? 1 : 0.8,
  }));

  return routes;
}

/**
 * BFF: Search endpoint.
 *
 * Proxies Constructor.io search. Currently does a simple text search over
 * the bundled catalog. When Constructor.io API key is available, this will
 * proxy to their API with the key stored server-side.
 */
import catalog from '../../assets/catalog.json';
import type { Catalog } from '../../src/data/types';

const data = catalog as unknown as Catalog;

export function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get('q')?.toLowerCase() ?? '';
  const limit = parseInt(url.searchParams.get('limit') ?? '20', 10);

  if (!query) {
    return Response.json({ results: [], total: 0, query: '' });
  }

  // Simple text search fallback until Constructor.io is wired up.
  // TODO: Replace with Constructor.io API call:
  //   const response = await fetch(
  //     `https://ac.cnstrc.com/search/${encodeURIComponent(query)}?key=${process.env.CONSTRUCTOR_API_KEY}&...`
  //   );
  const results = data.products.filter((p) => {
    const haystack = [
      p.name,
      p.franchise,
      p.cushion,
      p.description,
      ...p.colors.map((c) => c.name),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return haystack.includes(query);
  });

  return Response.json({
    results: results.slice(0, limit),
    total: results.length,
    query,
    source: 'catalog-snapshot',
  });
}

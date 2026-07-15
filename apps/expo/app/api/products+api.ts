/**
 * BFF: Product listing endpoint.
 *
 * Currently serves from the bundled catalog snapshot. When SFCC Shopper APIs
 * credentials are available, swap the data source here without touching the app.
 */
import catalog from '../../assets/catalog.json';
import type { Catalog, Product } from '../../src/data/types';

const data = catalog as unknown as Catalog;

export function GET(request: Request) {
  const url = new URL(request.url);
  const category = url.searchParams.get('category');
  const franchise = url.searchParams.get('franchise');
  const gender = url.searchParams.get('gender');
  const limit = parseInt(url.searchParams.get('limit') ?? '50', 10);
  const offset = parseInt(url.searchParams.get('offset') ?? '0', 10);

  let products: Product[] = data.products;

  if (category) {
    const cat = data.categories.find((c) => c.id === category);
    if (cat) {
      const ids = new Set(cat.productIds);
      products = products.filter((p) => ids.has(p.id));
      // Preserve category ordering
      const order = new Map(cat.productIds.map((id, i) => [id, i]));
      products.sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
    } else {
      products = products.filter((p) => p.groups.includes(category));
    }
  }

  if (franchise) {
    products = products.filter(
      (p) => p.franchise?.toLowerCase() === franchise.toLowerCase()
    );
  }

  if (gender) {
    products = products.filter((p) => p.gender === gender);
  }

  const total = products.length;
  const page = products.slice(offset, offset + limit);

  return Response.json({
    products: page,
    total,
    offset,
    limit,
    source: 'catalog-snapshot',
  });
}

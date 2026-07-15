/**
 * BFF: Category detail with products.
 *
 * Returns category metadata and its products. Currently reads from the
 * bundled catalog. Will call SFCC Shopper Products API when credentials
 * are available.
 */
import catalog from '../../../assets/catalog.json';
import type { Catalog } from '../../../src/data/types';

const data = catalog as unknown as Catalog;

export function GET(request: Request, { id }: { id: string }) {
  const url = new URL(request.url);
  const limit = parseInt(url.searchParams.get('limit') ?? '50', 10);
  const offset = parseInt(url.searchParams.get('offset') ?? '0', 10);

  const cat = data.categories.find((c) => c.id === id);

  if (!cat) {
    // Fall back to group-based lookup
    const products = data.products.filter((p) => p.groups.includes(id));
    if (products.length === 0) {
      return Response.json({ error: 'Category not found' }, { status: 404 });
    }
    return Response.json({
      category: { id, label: id, productCount: products.length },
      products: products.slice(offset, offset + limit),
      total: products.length,
      offset,
      limit,
      source: 'catalog-snapshot',
    });
  }

  const ids = new Set(cat.productIds);
  const order = new Map(cat.productIds.map((pid, i) => [pid, i]));
  const products = data.products
    .filter((p) => ids.has(p.id))
    .sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));

  return Response.json({
    category: { id: cat.id, label: cat.label, productCount: cat.productIds.length },
    products: products.slice(offset, offset + limit),
    total: products.length,
    offset,
    limit,
    source: 'catalog-snapshot',
  });
}

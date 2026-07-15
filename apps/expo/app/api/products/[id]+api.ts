/**
 * BFF: Product detail endpoint.
 *
 * Returns a single product with all colorways, sizes, and availability.
 * Currently reads from the bundled catalog. Will call SFCC Shopper Products
 * API when credentials are available.
 */
import catalog from '../../../assets/catalog.json';
import type { Catalog } from '../../../src/data/types';

const data = catalog as unknown as Catalog;

export function GET(_request: Request, { id }: { id: string }) {
  const product = data.products.find((p) => p.id === id);

  if (!product) {
    return Response.json({ error: 'Product not found' }, { status: 404 });
  }

  return Response.json({
    product,
    source: 'catalog-snapshot',
  });
}

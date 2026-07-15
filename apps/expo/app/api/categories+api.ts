/**
 * BFF: Categories endpoint.
 *
 * Returns the list of categories with product counts. Currently reads from
 * the bundled catalog. Will call SFCC Shopper Products API when credentials
 * are available.
 */
import catalog from '../../assets/catalog.json';
import type { Catalog } from '../../src/data/types';

const data = catalog as unknown as Catalog;

export function GET() {
  const categories = data.categories.map((c) => ({
    id: c.id,
    label: c.label,
    productCount: c.productIds.length,
  }));

  return Response.json({
    categories,
    source: 'catalog-snapshot',
  });
}

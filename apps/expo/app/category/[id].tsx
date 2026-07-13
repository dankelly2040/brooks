import { useLocalSearchParams } from 'expo-router';

import { NotBuilt } from '../../src/components/NotBuilt';
import { catalog } from '../../src/data/catalog';
import { productsIn } from '../../src/data/query';

export default function Category() {
  const { id, title } = useLocalSearchParams<{ id: string; title?: string }>();
  const products = productsIn(catalog, String(id));

  return (
    <NotBuilt
      title={title ? String(title) : 'Category'}
      spec="LLP 0003#plp"
      notes={[
        `${products.length} real products already resolve for this category via productsIn(catalog, "${id}").`,
        'ProductTile is built and handles colorway swatches, badges, sale pricing, and ratings — drop it into a 2-up grid.',
        'Filters: facetsFor() and applyFilters() in src/data/query.ts already implement Brooks’s real facet vocabulary.',
        'Sticky control row with Filter (n) + franchise quick-chips; filter sheet with a live “Apply · 23 results” count.',
      ]}
    />
  );
}

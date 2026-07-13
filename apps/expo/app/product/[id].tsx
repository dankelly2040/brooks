import { useLocalSearchParams } from 'expo-router';

import { NotBuilt } from '../../src/components/NotBuilt';
import { catalog } from '../../src/data/catalog';
import { byId } from '../../src/data/query';

export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = byId(catalog, String(id));

  return (
    <NotBuilt
      title={product ? product.name : 'Product'}
      spec="LLP 0003#pdp"
      notes={[
        product
          ? `Real data is loaded and ready: ${product.colors.length} colorways, $${product.price}, ${product.rating ?? '–'}★ from ${product.reviewCount} reviews.`
          : 'Product not found in the catalog snapshot.',
        'Per-size stock is real: colorway.sizes[].available comes from SFCC’s `selectable` flag (LLP 0002). Strike through what is out of stock.',
        'Color swatches must be real shoe thumbnails, not color dots — Brooks colorways are multi-color, so a dot lies.',
        'Width deserves equal rank with size: it is Brooks’s real differentiator vs Nike and adidas.',
        'Sticky “Add to Cart · $150.00”; on success, fly the shoe into the tab-bar bag and pop the lime badge.',
      ]}
    />
  );
}

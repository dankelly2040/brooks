// Contract boundary descriptors for the Brooks catalog helpers. Every export
// `use`d by a .contract file must be listed, or the compiler flags the import
// as opaque. All helpers are pure over the bundled snapshot: same arguments,
// same result — and stable references, so derives don't churn (LLP 0004).

import { defineContractModule, pure } from '@exact/contract/exports';

export default defineContractModule('./brooks.ts', {
  categories: pure({ params: [], result: 'Category[]', depends: 'args' }),
  categoryLabel: pure({ params: ['id'], result: 'string', depends: 'args' }),
  sized: pure({ params: ['bareUrl', 'px'], result: 'string', depends: 'args' }),
  gridFor: pure({ params: ['categoryId', 'query'], result: 'GridItem[]', depends: 'args' }),
  gridPage: pure({ params: ['items', 'limit'], result: 'GridItem[]', depends: 'args' }),
  gridItemIsFirstRow: pure({ params: ['items', 'id'], result: 'boolean', depends: 'args' }),
  gridTop: pure({ params: ['categoryId'], result: 'GridItem[]', depends: 'args' }),
  getProduct: pure({ params: ['id'], result: 'Product', depends: 'args' }),
  colorwayOf: pure({ params: ['productId', 'colorCode'], result: 'Colorway', depends: 'args' }),
  defaultColor: pure({ params: ['productId'], result: 'string', depends: 'args' }),
  defaultWidth: pure({ params: ['productId'], result: 'string', depends: 'args' }),
  imagesOf: pure({ params: ['productId', 'colorCode'], result: 'ProductImage[]', depends: 'args' }),
  mainImageUrl: pure({
    params: ['productId', 'colorCode', 'override'],
    result: 'string',
    depends: 'args',
  }),
  colorThumbUrl: pure({ params: ['productId', 'colorCode'], result: 'string', depends: 'args' }),
  sizesOf: pure({ params: ['productId', 'colorCode'], result: 'Size[]', depends: 'args' }),
  widthsOf: pure({ params: ['productId', 'colorCode'], result: 'Width[]', depends: 'args' }),
  priceOf: pure({ params: ['productId', 'colorCode'], result: 'number', depends: 'args' }),
  listPriceOf: pure({ params: ['productId', 'colorCode'], result: 'number', depends: 'args' }),
  genderLabel: pure({ params: ['productId'], result: 'string', depends: 'args' }),
  productEyebrow: pure({ params: ['productId'], result: 'string', depends: 'args' }),
  descriptionOf: pure({ params: ['productId'], result: 'string', depends: 'args' }),
  hasSoldOutSizes: pure({
    params: ['productId', 'colorCode'],
    result: 'boolean',
    depends: 'args',
  }),
  supportLabel: pure({ params: ['productId'], result: 'string', depends: 'args' }),
  starsLabel: pure({ params: ['rating'], result: 'string', depends: 'args' }),
  variantId: pure({
    params: ['productId', 'width', 'colorCode', 'size'],
    result: 'string',
    depends: 'args',
  }),
  addLine: pure({
    params: ['cart', 'productId', 'colorCode', 'size', 'width'],
    result: 'CartLine[]',
    depends: 'args',
  }),
  changeQty: pure({ params: ['cart', 'lineId', 'delta'], result: 'CartLine[]', depends: 'args' }),
  removeLine: pure({ params: ['cart', 'lineId'], result: 'CartLine[]', depends: 'args' }),
  cartCount: pure({ params: ['cart'], result: 'number', depends: 'args' }),
  cartSubtotal: pure({ params: ['cart'], result: 'number', depends: 'args' }),
  shippingFor: pure({ params: ['subtotal'], result: 'number', depends: 'args' }),
  freeShippingGap: pure({ params: ['subtotal'], result: 'number', depends: 'args' }),
  formatPrice: pure({ params: ['value'], result: 'string', depends: 'args' }),
  harvestedAt: pure({ params: [], result: 'string', depends: 'args' }),
  heroTargetMs: pure({ params: [], result: 'number', depends: 'args' }),
  countdownLabel: pure({ params: ['targetMs', 'nowMs'], result: 'string', depends: 'args' }),
  nextSecondAfter: pure({ params: ['nowMs'], result: 'number', depends: 'args' }),
});

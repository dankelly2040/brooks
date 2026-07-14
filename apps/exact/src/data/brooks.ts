/**
 * The Brooks catalog, shaped for Contract.
 *
 * @ref LLP 0002 — brooksrunning.com is behind Akamai Bot Manager, so the app
 * bundles the harvested snapshot (real products, prices, per-size stock) and
 * streams photography live from the open Brooks image CDN.
 *
 * @ref LLP 0004 — Contract derives propagate by reference (`Object.is`), so
 * every helper here returns either a primitive or a reference that is stable
 * for the same arguments: category lists are precomputed at module load, and
 * per-product lookups return the same raw catalog objects every call. Pure
 * helpers only; the .contract-meta.ts sidecar declares each one.
 */
import rawCatalog from './catalog.json';

export interface Size {
  readonly value: string;
  readonly label: string;
  readonly available: boolean;
}

export interface Width {
  readonly value: string;
  readonly label: string;
  readonly available: boolean;
}

export interface ProductImage {
  readonly url: string;
  readonly alt: string;
}

export interface Colorway {
  readonly code: string;
  readonly name: string;
  readonly images: readonly ProductImage[];
  readonly price: number | null;
  readonly listPrice: number | null;
  readonly sizeAttrId?: string;
  readonly sizes: readonly Size[];
  readonly widths: readonly Width[];
  readonly soldOut: boolean;
}

export interface Product {
  readonly id: string;
  readonly name: string;
  readonly gender: string | null;
  readonly productType: string;
  readonly franchise: string | null;
  readonly price: number | null;
  readonly listPrice: number | null;
  readonly onSale: boolean;
  readonly description: string;
  readonly bestFor: readonly string[];
  readonly features: readonly string[];
  readonly cushion: string | null;
  readonly support: string | null;
  readonly experience: string | null;
  readonly rating: number | null;
  readonly reviewCount: number;
  readonly badge: string | null;
  readonly groups: readonly string[];
  readonly colors: readonly Colorway[];
}

interface Catalog {
  readonly harvestedAt: string;
  readonly categories: readonly { id: string; label: string; productIds: string[] }[];
  readonly products: readonly Product[];
}

const CATALOG = rawCatalog as unknown as Catalog;

/* ------------------------------------------------------------- categories -- */

export interface Category {
  readonly id: string;
  readonly label: string;
}

/** The shop nav, in the order the Brooks site presents it. */
const CATEGORIES: readonly Category[] = [
  { id: 'featured-new-arrivals', label: 'New Arrivals' },
  { id: 'featured-best-sellers', label: 'Best Sellers' },
  { id: 'mens-shoes', label: "Men's Shoes" },
  { id: 'womens-shoes', label: "Women's Shoes" },
  { id: 'featured-trail-running-collection', label: 'Trail' },
  { id: 'mens-apparel', label: "Men's Apparel" },
  { id: 'womens-apparel', label: "Women's Apparel" },
  { id: 'sale', label: 'Sale' },
];

export function categories(): readonly Category[] {
  return CATEGORIES;
}

export function categoryLabel(id: string): string {
  return CATEGORIES.find((c) => c.id === id)?.label ?? 'Shop';
}

/* -------------------------------------------------------------- image CDN -- */

/**
 * Brooks's Demandware CDN resizes on demand; store bare URLs, size at the
 * call site (LLP 0002#image-cdn). `sfrm=png` keeps the alpha channel so shoes
 * sit on our own near-white field.
 */
export function sized(bareUrl: string, px: number): string {
  if (!bareUrl) return '';
  const base = bareUrl.split('?')[0];
  return `${base}?sw=${px}&sh=${px}&sm=fit&sfrm=png&strip=false&bgcolor=F8F8F8`;
}

/** Brooks encodes the shot angle before the slug; `l` is the lateral hero. */
function heroUrl(images: readonly ProductImage[]): string {
  const hero = images.find((i) => /-\d{3}-l-/.test(i.url));
  return (hero ?? images[0])?.url ?? '';
}

/* ------------------------------------------------------------ product grid -- */

export interface GridItem {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly listPrice: number;
  readonly onSale: boolean;
  readonly cushion: string;
  readonly badge: string;
  readonly rating: number;
  readonly reviewCount: number;
  readonly colorCount: number;
  readonly imageUrl: string;
  readonly searchKey: string;
}

function toGridItem(p: Product): GridItem {
  return {
    id: p.id,
    name: p.name,
    price: p.price ?? 0,
    listPrice: p.listPrice ?? 0,
    onSale: p.onSale,
    cushion: p.cushion ?? '',
    badge: p.badge === 'New Style' ? 'New' : p.onSale ? 'Sale' : '',
    rating: p.rating ?? 0,
    reviewCount: p.reviewCount,
    colorCount: p.colors.length,
    imageUrl: sized(heroUrl(p.colors[0]?.images ?? []), 480),
    searchKey: `${p.name} ${p.franchise ?? ''} ${p.cushion ?? ''}`.toLowerCase(),
  };
}

/** Grid rows per category, precomputed at load so references stay stable. */
const GRID_BY_CATEGORY: ReadonlyMap<string, readonly GridItem[]> = (() => {
  const m = new Map<string, readonly GridItem[]>();
  for (const cat of CATEGORIES) {
    const listed = CATALOG.categories.find((c) => c.id === cat.id);
    const products = listed
      ? CATALOG.products.filter((p) => listed.productIds.includes(p.id))
      : CATALOG.products.filter((p) => p.groups.includes(cat.id));
    m.set(
      cat.id,
      products.filter((p) => p.colors.length > 0).map(toGridItem)
    );
  }
  return m;
})();

const EMPTY_GRID: readonly GridItem[] = [];

/** Top-4 rows per category, precomputed so home rails get stable references. */
const TOP4_BY_CATEGORY: ReadonlyMap<string, readonly GridItem[]> = new Map(
  [...GRID_BY_CATEGORY.entries()].map(([id, items]) => [id, items.slice(0, 4)])
);

export function gridTop(categoryId: string): readonly GridItem[] {
  return TOP4_BY_CATEGORY.get(categoryId) ?? EMPTY_GRID;
}

/**
 * The browse grid: a category, optionally narrowed by a search query. Returns
 * plain scalar rows so the caller can stabilize with `memoRows("id")`.
 */
export function gridFor(categoryId: string, query: string): readonly GridItem[] {
  const base = GRID_BY_CATEGORY.get(categoryId) ?? EMPTY_GRID;
  const q = query.trim().toLowerCase();
  if (!q) return base;
  return base.filter((item) => item.searchKey.includes(q));
}

/**
 * Bound the Contract browse surface without pretending the current wrapping
 * grid is a virtualized list. Increasing `limit` exposes the next page while
 * preserving the stable precomputed row objects.
 */
export function gridPage(items: readonly GridItem[], limit: number): readonly GridItem[] {
  return items.slice(0, Math.max(0, Math.floor(limit)));
}

/** The widest desktop layout shows at most four cards in its first row. */
export function gridItemIsFirstRow(items: readonly GridItem[], id: string): boolean {
  return items.slice(0, 4).some((item) => item.id === id);
}

/* ------------------------------------------------------------ product page -- */

const BY_ID: ReadonlyMap<string, Product> = new Map(CATALOG.products.map((p) => [p.id, p]));

export function getProduct(id: string): Product {
  const p = BY_ID.get(id);
  if (!p) throw new Error(`Unknown product: ${id}`);
  return p;
}

export function colorwayOf(productId: string, colorCode: string): Colorway {
  const p = getProduct(productId);
  return p.colors.find((c) => c.code === colorCode) ?? p.colors[0];
}

export function defaultColor(productId: string): string {
  const p = getProduct(productId);
  return (p.colors.find((c) => !c.soldOut) ?? p.colors[0]).code;
}

/** Medium is the default width most people wear. */
export function defaultWidth(productId: string): string {
  const cw = colorwayOf(productId, defaultColor(productId));
  const avail = cw.widths.filter((w) => w.available);
  return (avail.find((w) => w.value === '1D' || w.value === '1B') ?? avail[0])?.value ?? '';
}

export function imagesOf(productId: string, colorCode: string): readonly ProductImage[] {
  return colorwayOf(productId, colorCode).images;
}

export function mainImageUrl(productId: string, colorCode: string, override: string): string {
  if (override) return sized(override, 900);
  return sized(heroUrl(imagesOf(productId, colorCode)), 900);
}

export function colorThumbUrl(productId: string, colorCode: string): string {
  return sized(heroUrl(imagesOf(productId, colorCode)), 160);
}

export function sizesOf(productId: string, colorCode: string): readonly Size[] {
  return colorwayOf(productId, colorCode).sizes;
}

export function widthsOf(productId: string, colorCode: string): readonly Width[] {
  return colorwayOf(productId, colorCode).widths;
}

export function priceOf(productId: string, colorCode: string): number {
  const cw = colorwayOf(productId, colorCode);
  return cw.price ?? getProduct(productId).price ?? 0;
}

export function listPriceOf(productId: string, colorCode: string): number {
  const cw = colorwayOf(productId, colorCode);
  return cw.listPrice ?? getProduct(productId).listPrice ?? 0;
}

export function genderLabel(productId: string): string {
  const g = getProduct(productId).gender;
  return g === 'womens' ? "Women's" : g === 'mens' ? "Men's" : g === 'unisex' ? 'Unisex' : '';
}

const DESCRIPTIONS: ReadonlyMap<string, string> = new Map(
  CATALOG.products.map((p) => [p.id, p.description.replace(/\s+/g, ' ').trim()])
);

/** Catalog descriptions carry raw line breaks from the SFCC editor; flatten. */
export function descriptionOf(productId: string): string {
  return DESCRIPTIONS.get(productId) ?? '';
}

/** "Women's · Glycerin" — the eyebrow line above the PDP title. */
export function productEyebrow(productId: string): string {
  const p = getProduct(productId);
  return [genderLabel(productId), p.franchise ?? 'Brooks'].filter(Boolean).join(' · ');
}

export function hasSoldOutSizes(productId: string, colorCode: string): boolean {
  return sizesOf(productId, colorCode).some((s) => !s.available);
}

const SUPPORT_LABEL: Record<string, string> = {
  neutral: 'Neutral',
  flexible_support: 'Flexible support',
  balanced_support: 'Balanced support',
  structured_support: 'Structured (GuideRails™)',
  max_support: 'Max support',
};

export function supportLabel(productId: string): string {
  const s = getProduct(productId).support;
  return s ? (SUPPORT_LABEL[s] ?? s) : '';
}

export function starsLabel(rating: number): string {
  if (!rating) return '';
  const full = Math.round(rating);
  return '★'.repeat(full) + '☆'.repeat(Math.max(0, 5 - full));
}

/* ------------------------------------------------------------------- cart -- */

/**
 * Brooks variant ids concatenate style, width, color, and zero-padded size:
 * 110498 + 1D + 197 + 9.0 -> "1104981D197.090".
 *
 * @ref LLP 0002#variant-id — confirmed by round-tripping through the real
 * Cart-AddProduct endpoint. Building this id is the point where the
 * prototype's cart and Brooks's production cart speak the same language.
 */
export function variantId(
  productId: string,
  width: string,
  colorCode: string,
  size: string
): string {
  const n = Number(size);
  const padded = Number.isFinite(n)
    ? `.${String(Math.round(n * 10)).padStart(3, '0')}`
    : `.${size}`;
  return `${productId}${width}${colorCode}${padded}`;
}

export interface CartLine {
  readonly id: string;
  readonly productId: string;
  readonly colorCode: string;
  readonly colorName: string;
  readonly size: string;
  readonly width: string;
  readonly widthLabel: string;
  readonly name: string;
  readonly price: number;
  readonly imageUrl: string;
  readonly qty: number;
}

export function addLine(
  cart: readonly CartLine[],
  productId: string,
  colorCode: string,
  size: string,
  width: string
): readonly CartLine[] {
  const id = variantId(productId, width, colorCode, size);
  const existing = cart.find((l) => l.id === id);
  if (existing) {
    return cart.map((l) => (l.id === id ? { ...l, qty: l.qty + 1 } : l));
  }
  const p = getProduct(productId);
  const cw = colorwayOf(productId, colorCode);
  const line: CartLine = {
    id,
    productId,
    colorCode,
    colorName: cw.name,
    size,
    width,
    widthLabel: cw.widths.find((w) => w.value === width)?.label ?? width,
    name: p.name,
    price: priceOf(productId, colorCode),
    imageUrl: sized(heroUrl(cw.images), 240),
    qty: 1,
  };
  return [line, ...cart];
}

export function changeQty(
  cart: readonly CartLine[],
  lineId: string,
  delta: number
): readonly CartLine[] {
  return cart
    .map((l) => (l.id === lineId ? { ...l, qty: l.qty + delta } : l))
    .filter((l) => l.qty > 0);
}

export function removeLine(cart: readonly CartLine[], lineId: string): readonly CartLine[] {
  return cart.filter((l) => l.id !== lineId);
}

export function cartCount(cart: readonly CartLine[]): number {
  return cart.reduce((n, l) => n + l.qty, 0);
}

export function cartSubtotal(cart: readonly CartLine[]): number {
  return cart.reduce((n, l) => n + l.price * l.qty, 0);
}

/** $5 flat, free over $100 — what the real Brooks cart returned (LLP 0002). */
export function shippingFor(subtotal: number): number {
  return subtotal === 0 || subtotal >= 100 ? 0 : 5;
}

export function freeShippingGap(subtotal: number): number {
  return Math.max(0, 100 - subtotal);
}

/* -------------------------------------------------------------- formatting -- */

export function formatPrice(value: number): string {
  if (!value) return '';
  return `$${value.toFixed(2).replace(/\.00$/, '')}`;
}

export function harvestedAt(): string {
  return new Date(CATALOG.harvestedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

/* -------------------------------------------------------------- countdown -- */

/** Josh Kerr's Project 222 record attempt: 2026-07-18 19:00 UTC (LLP 0003). */
export function heroTargetMs(): number {
  return Date.UTC(2026, 6, 18, 19, 0, 0);
}

export function countdownLabel(targetMs: number, nowMs: number): string {
  const remaining = Math.max(0, targetMs - nowMs);
  if (remaining === 0) return 'Race day';
  const s = Math.floor(remaining / 1000);
  const pad = (n: number) => String(n).padStart(2, '0');
  const days = Math.floor(s / 86400);
  const hours = Math.floor((s % 86400) / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  return `${pad(days)}d ${pad(hours)}h ${pad(mins)}m ${pad(secs)}s`;
}

/** The next whole-second boundary after `nowMs`, for temporal scheduling. */
export function nextSecondAfter(nowMs: number): number {
  return nowMs + (1000 - (nowMs % 1000)) || nowMs + 1000;
}

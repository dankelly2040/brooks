/**
 * BFF: Cart endpoint.
 *
 * Stubbed for now. When SFCC Shopper Baskets API credentials are available,
 * these will proxy basket operations with credentials stored server-side.
 *
 * GET  /api/cart          - Get current cart
 * POST /api/cart          - Add item to cart
 * PUT  /api/cart          - Update item quantity
 * DELETE /api/cart        - Remove item from cart
 */

export function GET() {
  // TODO: Call SFCC Shopper Baskets API
  // const response = await fetch(
  //   `${process.env.SFCC_BASE_URL}/checkout/shopper-baskets/v1/organizations/${org}/baskets/${basketId}`,
  //   { headers: { Authorization: `Bearer ${token}` } }
  // );
  return Response.json({
    items: [],
    subtotal: 0,
    total: 0,
    currency: 'USD',
    source: 'stub',
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { productId, colorCode, size, width, quantity } = body;

  if (!productId || !colorCode || !size || !width) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // TODO: Call SFCC Shopper Baskets API to add item
  return Response.json({
    added: { productId, colorCode, size, width, quantity: quantity ?? 1 },
    source: 'stub',
  }, { status: 201 });
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const itemId = url.searchParams.get('itemId');

  if (!itemId) {
    return Response.json({ error: 'Missing itemId' }, { status: 400 });
  }

  // TODO: Call SFCC Shopper Baskets API to remove item
  return Response.json({ removed: itemId, source: 'stub' });
}

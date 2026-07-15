/**
 * BFF: Guest session endpoint.
 *
 * Stubbed for now. When SFCC SLAS credentials are available, this will
 * create a guest token for anonymous browsing and cart operations.
 *
 * POST /api/auth/guest - Create a guest session
 */

export async function POST() {
  // TODO: Create guest token via SFCC SLAS
  // const response = await fetch(
  //   `${process.env.SFCC_SLAS_URL}/shopper/auth/v1/organizations/${org}/oauth2/token`,
  //   {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  //     body: new URLSearchParams({
  //       grant_type: 'client_credentials',
  //       client_id: process.env.SFCC_CLIENT_ID,
  //     }),
  //   }
  // );

  return Response.json({
    message: 'Guest auth not yet configured. SFCC SLAS credentials required.',
    source: 'stub',
  }, { status: 501 });
}

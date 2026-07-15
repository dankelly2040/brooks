/**
 * BFF: Auth login endpoint.
 *
 * Stubbed for now. When SFCC SLAS credentials are available, this will
 * handle the OAuth 2.0 PKCE flow with credentials stored server-side.
 *
 * POST /api/auth/login - Exchange auth code for tokens
 */

export async function POST(request: Request) {
  const body = await request.json();
  const { code, codeVerifier, redirectUri } = body;

  if (!code || !codeVerifier) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // TODO: Exchange auth code for tokens via SFCC SLAS
  // const response = await fetch(
  //   `${process.env.SFCC_SLAS_URL}/shopper/auth/v1/organizations/${org}/oauth2/token`,
  //   {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  //     body: new URLSearchParams({
  //       grant_type: 'authorization_code_pkce',
  //       code,
  //       code_verifier: codeVerifier,
  //       redirect_uri: redirectUri,
  //       client_id: process.env.SFCC_CLIENT_ID,
  //     }),
  //   }
  // );

  return Response.json({
    message: 'Auth not yet configured. SFCC SLAS credentials required.',
    source: 'stub',
  }, { status: 501 });
}

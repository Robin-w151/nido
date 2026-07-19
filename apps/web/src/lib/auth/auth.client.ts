import { signOut as remoteSignOut } from '$lib/auth/auth.remote';
import { createAuthClient } from 'better-auth/client';
import { genericOAuthClient } from 'better-auth/client/plugins';

const authClient = createAuthClient({
  plugins: [genericOAuthClient()],
});

export function signIn() {
  return authClient.signIn.oauth2({ providerId: 'keycloak', callbackURL: '/' });
}

export async function signOut() {
  await authClient.signOut();
  const { signOutUrl } = await remoteSignOut();
  globalThis.location.href = signOutUrl;
}

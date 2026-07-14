import { createAuthClient } from 'better-auth/client';
import { genericOAuthClient } from 'better-auth/client/plugins';
import { signOut as remoteSignOut } from '$lib/auth/client/auth.remote';

export const authClient = createAuthClient({
  plugins: [genericOAuthClient()],
});

export async function signOut(): Promise<void> {
  await authClient.signOut();
  const { signOutUrl } = await remoteSignOut();
  globalThis.location.href = signOutUrl;
}

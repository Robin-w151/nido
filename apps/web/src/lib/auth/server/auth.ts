import { BETTER_AUTH_SECRET, CLIENT_ID, CLIENT_SECRET, ISSUER, ORIGIN } from '$app/env/private';
import { getRequestEvent } from '$app/server';
import { db } from '$lib/db';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { betterAuth } from 'better-auth/minimal';
import { genericOAuth, keycloak } from 'better-auth/plugins';
import { sveltekitCookies } from 'better-auth/svelte-kit';

export const auth = betterAuth({
  baseURL: ORIGIN,
  secret: BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, { provider: 'pg' }),
  emailAndPassword: { enabled: true },
  plugins: [
    genericOAuth({
      config: [
        keycloak({
          clientId: CLIENT_ID,
          clientSecret: CLIENT_SECRET,
          issuer: ISSUER,
        }),
      ],
    }),
    sveltekitCookies(getRequestEvent), // make sure this is the last plugin in the array
  ],
});

import { defineEnvVars } from '@sveltejs/kit/hooks';
import * as v from 'valibot';

export const variables = defineEnvVars({
  DATABASE_URL: {
    schema: v.pipe(v.string(), v.url()),
  },
  ORIGIN: {
    schema: v.pipe(v.string(), v.url()),
  },
  BETTER_AUTH_SECRET: {
    schema: v.string(),
  },
  CLIENT_ID: {
    schema: v.string(),
  },
  CLIENT_SECRET: {
    schema: v.string(),
  },
  ISSUER: {
    schema: v.pipe(v.string(), v.url()),
  },
});

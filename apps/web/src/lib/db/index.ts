import { DATABASE_URL } from '$app/env/private';
import { drizzle } from 'drizzle-orm/postgres-js';
import { relations } from './relations';

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

export const db = drizzle(DATABASE_URL, { relations });

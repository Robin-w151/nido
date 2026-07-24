import { CLIENT_ID, ISSUER, ORIGIN } from '$app/env/private';
import { getRequestEvent, query } from '$app/server';
import { redirect } from '@sveltejs/kit';

export const checkLoggedIn = query(async () => {
  const event = getRequestEvent();
  if (event.locals.user) {
    return {
      user: event.locals.user,
    };
  } else {
    return redirect(302, '/login');
  }
});

export const checkLoggedInForCommand = query(async () => {
  const event = getRequestEvent();
  if (event.locals.user) {
    return {
      user: event.locals.user,
    };
  } else {
    return { redirect: '/login' } as const;
  }
});

export const signOut = query(async () => {
  return {
    signOutUrl: `${ISSUER}/protocol/openid-connect/logout?client_id=${CLIENT_ID}&post_logout_redirect_uri=${ORIGIN}`,
  };
});

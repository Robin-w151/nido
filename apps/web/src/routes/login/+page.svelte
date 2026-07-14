<script lang="ts">
  import { authClient } from '$lib/auth/client/auth';

  let errorMessage = $state<string | undefined>(undefined);

  async function handleSignIn(): Promise<void> {
    const response = await authClient.signIn.oauth2({ providerId: 'keycloak', callbackURL: '/' });
    if ('error' in response) {
      errorMessage = response.error?.message;
    }
  }
</script>

<h1>Sign In</h1>
<button onclick={handleSignIn}>Sign In</button>

{#if errorMessage}
  <p>{errorMessage}</p>
{/if}

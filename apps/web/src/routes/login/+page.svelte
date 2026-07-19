<script lang="ts">
  import { signIn } from '$lib/auth/auth.client';

  let errorMessage = $state<string | undefined>(undefined);

  async function handleSignIn(): Promise<void> {
    const response = await signIn();
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

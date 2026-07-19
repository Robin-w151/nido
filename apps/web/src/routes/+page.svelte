<script lang="ts">
  import { signOut } from '$lib/auth/auth.client';
  import { checkLoggedIn } from '$lib/auth/auth.remote';

  const checkLoggedInQuery = checkLoggedIn();

  async function handleSignOut(): Promise<void> {
    await signOut();
  }

  function handleUserRefresh(): void {
    checkLoggedInQuery.refresh();
  }
</script>

{#if checkLoggedInQuery.error}
  <h1>Error</h1>
  <p>{checkLoggedInQuery.error}</p>
{:else if checkLoggedInQuery.current}
  {const { user } = $derived(checkLoggedInQuery.current)}
  <h1>Hi, {user.name}!</h1>
  <p>Your user ID is {user.id}.</p>
  <div class="actions">
    <button onclick={handleSignOut}>Sign out</button>
    <button onclick={handleUserRefresh}>Refresh</button>
  </div>
{:else if checkLoggedInQuery.loading}
  <p>Loading...</p>
{/if}

<style>
  .actions {
    display: flex;
    gap: 0.5rem;
  }
</style>

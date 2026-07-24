<script lang="ts">
  import favicon from '$lib/assets/favicon.svg';
  import type { Snippet } from 'svelte';
  import AppHeader from './AppHeader.svelte';
  import '../../app.css';

  interface Props {
    children: Snippet;
  }

  const { children }: Props = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<AppHeader />
<main>
  {@render children()}
</main>

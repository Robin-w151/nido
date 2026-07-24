<script lang="ts">
  import AppLayout from '$lib/app-shell/AppLayout.svelte';

  let { children } = $props();
</script>

<AppLayout>{@render children()}</AppLayout>

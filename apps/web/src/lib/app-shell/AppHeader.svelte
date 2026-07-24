<script lang="ts">
  import { resolve } from '$app/paths';
</script>

<header>
  <a href={resolve('/')} class="app-title">Nido</a>
  <nav>
    <a href={resolve('/groups')}>Groups</a>
  </nav>
</header>

<style>
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    height: 2rem;
    background-color: lightblue;

    .app-title {
      color: black;
      font-size: 2rem;
      text-decoration: none;
    }

    nav {
      display: flex;
      gap: 0.5rem;
    }
  }
</style>

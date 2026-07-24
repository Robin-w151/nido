<script lang="ts">
  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';
  import { createGroup } from '$lib/groups/groups.remote';
</script>

<h1>New Group</h1>
<form {...createGroup}>
  <div class="form-group">
    <label for="add-group-name">Name</label>
    <input type="text" id="add-group-name" name="name" />
    {#each createGroup.fields.name.issues() as issue (issue)}
      <p>{issue.message}</p>
    {/each}
  </div>
  <div class="actions">
    <button type="button" onclick={() => goto(resolve('/groups'))}>Cancel</button>
    <button>Save</button>
  </div>
</form>

<style>
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .actions {
    display: flex;
    gap: 0.5rem;
    margin-block: 1rem;
  }
</style>

<script lang="ts">
  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';
  import { joinGroup, queryGroupInvitations, queryGroups } from '$lib/groups/groups.remote';

  function handleRefresh() {
    queryGroups().refresh();
    queryGroupInvitations().refresh();
  }

  async function handleJoinGroup(groupId: number) {
    const result = await joinGroup(groupId);
    if (result?.redirect) {
      goto(resolve(result.redirect));
    } else {
      goto(resolve('/groups/[groupId]', { groupId: `${groupId}` }));
    }
  }
</script>

<h1>My Groups</h1>
<table>
  <thead>
    <tr>
      <th>Group</th>
      <th>Members</th>
    </tr>
  </thead>
  <tbody>
    {#each await queryGroups() as group (group.id)}
      <tr>
        <td>
          <a
            href={resolve('/groups/[groupId]', {
              groupId: `${group.id}`,
            })}>{group.name}</a
          >
        </td>
        <td>{group.members}</td>
      </tr>
    {:else}
      <tr>
        <td colspan="2">You are currently in no group.</td>
      </tr>
    {/each}
  </tbody>
</table>

{const invitations = $derived(await queryGroupInvitations())}
{#if invitations.length > 0}
  <h2>Invitations</h2>
  <table>
    <thead>
      <tr>
        <th>Group</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {#each invitations as invite (invite.id)}
        <tr>
          <td>
            {invite.name}
          </td>
          <td>
            <button onclick={() => handleJoinGroup(invite.id)}>Join Group</button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}

<div class="actions">
  <button onclick={handleRefresh}>Refresh</button>
  <button onclick={() => goto(resolve('/groups/new'))}>New Group</button>
</div>

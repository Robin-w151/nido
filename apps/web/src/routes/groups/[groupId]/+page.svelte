<script lang="ts">
  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';
  import { deleteGroup, inviteGroupMember, queryGroup, queryGroupMembers } from '$lib/groups/groups.remote';
  import type { EnhanceFormParameter } from '$lib/shared/remote-functions';
  import type { HttpError } from '@sveltejs/kit';
  import type { PageProps } from './$types';

  const { params }: PageProps = $props();

  const groupId = $derived(parseInt(params.groupId));
  const group = $derived(await queryGroup(groupId));
  const groupMembers = $derived(await queryGroupMembers(groupId));

  let inviteError = $state<string | undefined>();

  async function handleDeleteGroup() {
    const result = await deleteGroup(groupId);
    if (result?.redirect) {
      goto(resolve(result.redirect));
    } else {
      goto(resolve('/groups'));
    }
  }

  async function handleInviteGroupMemberSubmit(form: EnhanceFormParameter<typeof inviteGroupMember>) {
    inviteError = undefined;

    try {
      if (await form.submit()) {
        form.element.reset();
      } else {
        console.log('Invalid data!');
      }
    } catch (error) {
      inviteError = (error as HttpError).body.message;
    }
  }
</script>

{#if group}
  <h1>Group {group.name}</h1>
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>E-Mail</th>
        <th>Role</th>
      </tr>
    </thead>
    <tbody>
      {#each groupMembers as member (member.email)}
        <tr>
          <td>{member.name}</td>
          <td>{member.email}</td>
          <td>{member.role}</td>
        </tr>
      {/each}
    </tbody>
  </table>
  <div class="actions">
    <button onclick={() => queryGroupMembers(groupId).refresh()}>Refresh</button>
    <button onclick={handleDeleteGroup}>Delete Group</button>
  </div>
  <form {...inviteGroupMember.enhance(handleInviteGroupMemberSubmit)}>
    <input {...inviteGroupMember.fields.groupId.as('hidden', groupId)} />
    <div class="form-group">
      <label for="invite-group-member-email">E-Mail</label>
      <input id="invite-group-member-email" {...inviteGroupMember.fields.email.as('email')} />
      {#each inviteGroupMember.fields.email.issues() as issue (issue.path)}
        <span class="error">{issue.message}</span>
      {/each}
      {#if inviteError}
        <span class="error">{inviteError}</span>
      {/if}
    </div>
    <div class="actions">
      <button>Invite</button>
    </div>
  </form>
{:else}
  <p>Group not found!</p>
{/if}

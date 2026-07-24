import { command, form, query } from '$app/server';
import { checkLoggedIn, checkLoggedInForCommand } from '$lib/auth/auth.remote';
import { redirect } from '@sveltejs/kit';
import * as v from 'valibot';
import {
  findGroupById,
  findGroupInvitationsByUserId,
  findGroupMembersById,
  findGroupsByUserId,
  GroupRepository,
} from './groups.repository';
import { CreateGroup } from './groups.schema';

export const queryGroups = query(async () => {
  const { user } = await checkLoggedIn();
  return findGroupsByUserId(user.id);
});

export const queryGroupInvitations = query(async () => {
  const { user } = await checkLoggedIn();
  return findGroupInvitationsByUserId(user.id);
});

export const queryGroup = query(v.number(), async (groupId) => {
  const { user } = await checkLoggedIn();
  return findGroupById(groupId, user.id);
});

export const queryGroupMembers = query(v.number(), async (groupId) => {
  const { user } = await checkLoggedIn();
  return findGroupMembersById(groupId, user.id);
});

export const createGroup = form(CreateGroup, async (group) => {
  const { user } = await checkLoggedIn();
  await GroupRepository.createGroup(group, user.id);
  return redirect(302, '/groups');
});

export const deleteGroup = command(v.number(), async (groupId) => {
  const { user, redirect } = await checkLoggedInForCommand();
  if (redirect !== undefined) {
    return { redirect };
  }

  await GroupRepository.deleteGroup(groupId, user.id);
});

export const inviteGroupMember = form(
  v.object({ groupId: v.number(), email: v.pipe(v.string(), v.email()) }),
  async ({ groupId, email }) => {
    const { user } = await checkLoggedIn();
    await GroupRepository.inviteGroupMember(groupId, email, user.id);
    queryGroupMembers(groupId).refresh();
  },
);

export const joinGroup = command(v.number(), async (groupId) => {
  const { user, redirect } = await checkLoggedInForCommand();
  if (redirect !== undefined) {
    return { redirect };
  }

  await GroupRepository.joinGroup(groupId, user.id);
});

import { user } from '$lib/auth/auth.schema';
import { db } from '$lib/db';
import { error } from '@sveltejs/kit';
import { and, asc, count, eq, inArray, ne } from 'drizzle-orm';
import { groupEntity, MemberRole, memberRoles, usersToGroupsEntity, type CreateGroup } from './groups.schema';

interface FunctionContext {
  tx?: Parameters<Parameters<typeof db.transaction>[0]>[0];
}

export async function findGroupsByUserId(userId: string | undefined) {
  if (!userId) {
    return [];
  }

  return db.transaction(async (tx) => {
    const groups = await tx
      .select()
      .from(groupEntity)
      .innerJoin(usersToGroupsEntity, eq(groupEntity.id, usersToGroupsEntity.groupId))
      .where(and(eq(usersToGroupsEntity.userId, userId), inArray(usersToGroupsEntity.role, memberRoles)))
      .orderBy(asc(groupEntity.name));

    const groupIds = groups.map(({ group }) => group.id);

    const groupMemberCounts = await tx
      .select({
        groupId: usersToGroupsEntity.groupId,
        members: count(usersToGroupsEntity.userId),
      })
      .from(usersToGroupsEntity)
      .where(and(inArray(usersToGroupsEntity.groupId, groupIds), ne(usersToGroupsEntity.role, 'INVITED')))
      .groupBy(usersToGroupsEntity.groupId);

    const groupMemberCountMap = new Map(groupMemberCounts.map(({ groupId, members }) => [groupId, members]));

    return groups.map(({ group }) => ({ ...group, members: groupMemberCountMap.get(group.id) ?? 0 }));
  });
}

export async function findGroupInvitationsByUserId(userId: string | undefined) {
  if (!userId) {
    return [];
  }

  const result = await db
    .select()
    .from(groupEntity)
    .innerJoin(usersToGroupsEntity, eq(groupEntity.id, usersToGroupsEntity.groupId))
    .where(and(eq(usersToGroupsEntity.userId, userId), eq(usersToGroupsEntity.role, 'INVITED')))
    .orderBy(asc(groupEntity.name));

  return result.map(({ group }) => group);
}

export async function findGroupById(groupId: number, userId: string) {
  return db.query.group.findFirst({
    where: {
      id: groupId,
      users: {
        id: userId,
      },
    },
  });
}

export async function findGroupMembersById(groupId: number, userId: string) {
  if (!(await isMember(groupId, userId))) {
    error(401, 'Unauthorized!');
  }

  const result = await db
    .select()
    .from(user)
    .innerJoin(usersToGroupsEntity, eq(user.id, usersToGroupsEntity.userId))
    .where(eq(usersToGroupsEntity.groupId, groupId));

  return result.map(({ user, users_to_groups }) => ({
    name: user.name,
    email: user.email,
    role: users_to_groups.role,
  }));
}

export async function createGroup(createGroup: CreateGroup, userId: string) {
  await db.transaction(async (tx) => {
    const createdGroups = await tx.insert(groupEntity).values(createGroup).returning();
    for (const { id } of createdGroups) {
      await tx.insert(usersToGroupsEntity).values({ userId, groupId: id, role: 'ADMIN' });
    }
  });
}

export async function deleteGroup(groupId: number, userId: string) {
  try {
    await db.transaction(async (tx) => {
      if (!(await isMember(groupId, userId, { tx, requiredRole: 'ADMIN' }))) {
        tx.rollback();
        return;
      }

      await tx.delete(usersToGroupsEntity).where(eq(usersToGroupsEntity.groupId, groupId));
      await tx.delete(groupEntity).where(eq(groupEntity.id, groupId));
    });
  } catch (_error) {
    error(401, 'Unauthorized!');
  }
}

export async function inviteGroupMember(groupId: number, email: string, userId: string) {
  if (!(await isMember(groupId, userId, { requiredRole: 'ADMIN' }))) {
    error(401, 'Unauthorized!');
  }

  const newUser = await findUserByEmail(email);
  if (!newUser) {
    error(404, 'User with this E-Mail does not exist!');
  }

  try {
    await db.insert(usersToGroupsEntity).values({ userId: newUser.id, groupId, role: 'INVITED' });
  } catch (_error) {
    error(400, 'User is already member of this group!');
  }
}

export async function joinGroup(groupId: number, userId: string) {
  try {
    await db.transaction(async (tx) => {
      if (!(await isInvited(groupId, userId, { tx }))) {
        tx.rollback();
        return;
      }

      await tx
        .update(usersToGroupsEntity)
        .set({ role: 'USER' })
        .where(and(eq(usersToGroupsEntity.groupId, groupId), eq(usersToGroupsEntity.userId, userId)));
    });
  } catch (_error) {
    error(401, 'Unauthorized!');
  }
}

async function isMember(
  groupId: number,
  userId: string,
  options: FunctionContext & {
    requiredRole?: MemberRole;
  } = {},
) {
  const { tx = db, requiredRole } = options;

  const [assignment] = await tx
    .select()
    .from(usersToGroupsEntity)
    .where(
      and(
        eq(usersToGroupsEntity.groupId, groupId),
        eq(usersToGroupsEntity.userId, userId),
        inArray(usersToGroupsEntity.role, memberRoles),
      ),
    );

  if (!assignment) {
    return false;
  }

  return !requiredRole || assignment.role === requiredRole;
}

async function isInvited(groupId: number, userId: string, options: FunctionContext = {}) {
  const { tx = db } = options;

  const [assignment] = await tx
    .select()
    .from(usersToGroupsEntity)
    .where(
      and(
        eq(usersToGroupsEntity.groupId, groupId),
        eq(usersToGroupsEntity.userId, userId),
        eq(usersToGroupsEntity.role, 'INVITED'),
      ),
    );

  return !!assignment;
}

async function findUserByEmail(email: string) {
  return db.query.user.findFirst({
    where: {
      email,
    },
  });
}

export const GroupRepository = {
  findGroupsByUserId,
  findGroupById,
  findGroupMembersById,
  createGroup,
  deleteGroup,
  inviteGroupMember,
  joinGroup,
};

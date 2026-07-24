import { defineRelations } from 'drizzle-orm';
import { account, groupEntity, session, user, usersToGroupsEntity } from './schema';

export const relations = defineRelations(
  { user, session, account, group: groupEntity, usersToGroups: usersToGroupsEntity },
  (r) => ({
    user: {
      sessions: r.many.session({}),
      accounts: r.many.account({}),
      groups: r.many.group(),
    },
    session: {
      user: r.one.user({
        from: r.session.userId,
        to: r.user.id,
      }),
    },
    account: {
      user: r.one.user({
        from: r.account.userId,
        to: r.user.id,
      }),
    },
    group: {
      users: r.many.user({
        from: r.group.id.through(r.usersToGroups.groupId),
        to: r.user.id.through(r.usersToGroups.userId),
      }),
    },
  }),
);

import { integer, pgEnum, pgTable, primaryKey, serial, text } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-orm/valibot';
import * as v from 'valibot';
import { user } from '../auth/auth.schema';

export const groupRoles = ['ADMIN', 'USER', 'INVITED'] as const;
export const GroupRole = v.picklist(groupRoles);
export type GroupRole = v.InferInput<typeof GroupRole>;

export const memberRoles = ['ADMIN', 'USER'] as const;
export const MemberRole = v.picklist(memberRoles);
export type MemberRole = v.InferInput<typeof MemberRole>;

export const groupEntity = pgTable('group', {
  id: serial().primaryKey(),
  name: text().notNull(),
});

export const groupRole = pgEnum('group_role', groupRoles);

export const usersToGroupsEntity = pgTable(
  'users_to_groups',
  {
    userId: text('user_id')
      .notNull()
      .references(() => user.id),
    groupId: integer('group_id')
      .notNull()
      .references(() => groupEntity.id),
    role: groupRole().notNull().default('USER'),
  },
  (table) => [primaryKey({ columns: [table.userId, table.groupId] })],
);

export const CreateGroup = createInsertSchema(groupEntity, {
  name: (schema) => v.pipe(schema, v.minLength(1), v.maxLength(256)),
});
export type CreateGroup = v.InferInput<typeof CreateGroup>;

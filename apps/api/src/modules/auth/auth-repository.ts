import { eq, type EmptyRelations } from "drizzle-orm";
import type { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import type { PgAsyncTransaction } from "drizzle-orm/pg-core";
import { refreshTokenTable, usersTable } from "../../db/schema/schema";
import { db } from "../../db/drizzle";

export const addNewUser = async (
  tx: PgAsyncTransaction<NodePgQueryResultHKT, EmptyRelations>,
  email: string,
  hashedPass: string,
) => {
  await tx.insert(usersTable).values({
    email: email,
    password: hashedPass,
    role: "customer",
  });
};

export const findUserByEmail = async (
  tx: PgAsyncTransaction<NodePgQueryResultHKT, EmptyRelations>,
  email: string,
) => {
  const user = await tx.select().from(usersTable).where(eq(usersTable.email, email));
  return user[0];
};
export const findUserByRefreshToken = async (
  tx: PgAsyncTransaction<NodePgQueryResultHKT, EmptyRelations>,
  refreshToken: string,
) => {
  const user = await tx
    .select()
    .from(usersTable)
    .innerJoin(refreshTokenTable, eq(refreshTokenTable.token, refreshToken));
  return user[0]?.users;
};

export const insertOrUpdateRefreshToken = async (
  tx: PgAsyncTransaction<NodePgQueryResultHKT, EmptyRelations>,
  refreshToken: string,
  userId: string,
) => {
  await tx
    .insert(refreshTokenTable)
    .values({ userId, token: refreshToken })
    .onConflictDoUpdate({
      target: refreshTokenTable.userId,
      set: { token: refreshToken },
    });
};

export const deleteRefreshToken = async (refreshToken: string) => {
  await db.delete(refreshTokenTable).where(eq(refreshTokenTable.token, refreshToken));
};

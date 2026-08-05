import type { EmptyRelations } from "drizzle-orm";
import type { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import type { PgAsyncTransaction } from "drizzle-orm/pg-core";
import { usersTable } from "../../db/schema/schema";

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

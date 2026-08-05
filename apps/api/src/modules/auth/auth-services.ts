import { eq } from "drizzle-orm";
import { db } from "../../db/drizzle";
import { usersTable } from "../../db/schema/schema";
import { ApiError } from "../../utils/ApiError";
import { hash } from "bcrypt";
import logger from "../../utils/logger";
import { addNewUser } from "./auth-repository";

export const signIn = async (email: string, password: string) => {
  await db.transaction(async (tx) => {
    const user = await tx
      .select({ email: usersTable.email })
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (user.length > 0) throw new ApiError(409, "User already registered");

    const hashedPass = await hash(password, 10);
    await addNewUser(tx, email, hashedPass);

    logger.info("user created successfully");
  });
};

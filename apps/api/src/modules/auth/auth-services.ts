import { eq } from "drizzle-orm";
import { db } from "../../db/drizzle";
import { usersTable } from "../../db/schema/schema";
import { ApiError } from "../../utils/ApiError";
import { hash } from "bcrypt";
import logger from "../../utils/logger";
import {
  addNewUser,
  findUserByEmail,
  insertOrUpdateRefreshToken,
} from "./auth-repository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateToken } from "../../utils/jwt";
import { env } from "../../config/validateEnvs";

export const signIn = async (email: string, password: string) => {
  await db.transaction(async (tx) => {
    const user = await findUserByEmail(tx, email);

    if (user) throw new ApiError(409, "User already registered");

    const hashedPass = await hash(password, 10);
    await addNewUser(tx, email, hashedPass);

    logger.info("user created successfully");
  });
};

export const logIn = async (email: string, password: string) => {
  return await db.transaction(async (tx) => {
    const user = await findUserByEmail(tx, email);

    // user does not exist
    if (!user) throw new ApiError(400, "Authentication failed");

    // check password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) throw new ApiError(400, "Authentication failed");

    const accessToken = await generateToken(
      {
        id: user.id,
        role: user.role,
      },
      env.JWT_ACCESS_TOKEN_SECRET,
      env.JWT_ACCESS_TOKEN_TIME_IN_MS,
    );
    const refreshToken = await generateToken(
      {
        id: user.id,
        role: user.role,
      },
      env.JWT_REFRESH_TOKEN_SECRET,
      env.JWT_REFRESH_TOKEN_TIME_IN_MS,
    );

    // store/update refresh token in db
    await insertOrUpdateRefreshToken(tx, refreshToken, user.id);
    const accountInfo = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    return { accessToken, refreshToken, accountInfo };
  });
};

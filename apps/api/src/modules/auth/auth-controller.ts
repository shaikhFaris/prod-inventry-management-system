import { type RequestHandler } from "express";
import type z from "zod";
import type { loginSchema, signUpSchema } from "./auth-schema";
import { logIn, signIn } from "./auth-services";
import logger from "../../utils/logger";
import { clearAllCookies, setAllCookies } from "../../utils/cookie";

type SignUpBody = z.infer<typeof signUpSchema>;
type LoginBody = z.infer<typeof loginSchema>;

//request handlers automatically catch and pass the errors to the global error handlers
export const handleSignUp: RequestHandler = async (req, res) => {
  const {
    body: { email, password },
  } = req as SignUpBody;

  await signIn(email, password);

  res.status(201).json({
    message: "User created successfully, Please login.",
  });
};

export const handleLogin: RequestHandler = async (req, res) => {
  const {
    body: { email, password },
  } = req as LoginBody;

  const { accessToken, refreshToken, accountInfo } = await logIn(email, password);

  clearAllCookies(res);
  setAllCookies(res, accessToken, refreshToken);

  res.status(200).json(accountInfo);
};

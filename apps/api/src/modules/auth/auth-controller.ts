import { type RequestHandler } from "express";
import type z from "zod";
import type { signUpSchema } from "./auth-schema";
import { signIn } from "./auth-services";

type SignUpBody = z.infer<typeof signUpSchema>;
export const handleSignUp: RequestHandler = async (req, res, next) => {
  try {
    const {
      body: { email, password },
    } = req as SignUpBody;

    await signIn(email, password);

    res.status(200).json({
      message: "user created",
    });
  } catch (error) {
    next(error);
  }
};

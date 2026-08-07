import express, { type Router } from "express";
import { validate } from "../../utils/validate";
import { loginSchema, signUpSchema } from "./auth-schema";
import { handleLogin, handleSignUp } from "./auth-controller";

const authRoutes: Router = express.Router();

authRoutes.post("/signup", validate(signUpSchema), handleSignUp);

authRoutes.post("/login", validate(loginSchema), handleLogin);

export { authRoutes };

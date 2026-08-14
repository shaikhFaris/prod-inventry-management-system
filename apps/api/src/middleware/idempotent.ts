import type { RequestHandler } from "express";
import { ApiError } from "../utils/ApiError";
import { redis } from "../redis";

export const idempotent: RequestHandler = async (req, res, next) => {
  const key = req.headers["idempotency-key"];
  if (!key || Array.isArray(key)) throw new ApiError(400, "Invalid request");
  const cachedData = await redis.get(`idempotency:orders:${key}`);
  console.log("Idempotent ", cachedData);
  if (!cachedData) return next();
  return res.status(200).json(JSON.parse(cachedData));
};

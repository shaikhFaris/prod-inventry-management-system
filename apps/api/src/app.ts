import express, { type Express } from "express";
import morgan from "morgan";

const app: Express = express();

app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json("Hello");
});

export default app;

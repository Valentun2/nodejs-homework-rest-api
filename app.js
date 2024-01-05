import express, { json } from "express";
import logger from "morgan";
import cors from "cors";
import dotenv from "dotenv"
import contactsRouter from "./routes/api/contacts.js";
import authRouter from "./routes/users.js"
dotenv.config()
const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(json());

app.use("/api/contacts", contactsRouter);
app.use("/users", authRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  console.log(err.message);
  res.status(err.status).json({ message: err.message });
});

export default app;

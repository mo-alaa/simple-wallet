import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { errorHandler } from "./api/middlewares/errorHandler";
const userRouter = require("./api/routes/user");
const transactionRouter = require("./api/routes/transaction");

const app = express();
const port = process.env.PORT || 4000;
const jsonParser = bodyParser.json();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(jsonParser);
app.use(cookieParser());

app.use("/user", userRouter);
app.use("/transaction", transactionRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}.`);
});

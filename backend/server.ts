import express, { Request, Response } from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
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

interface JwtPayload {
  userId: number;
}

app.use((req: MyUserRequest, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const secret: string = process.env.APP_SECRET as string;
    const { userId } = jwt.verify(token, secret) as JwtPayload;
    if (userId) req.userId = userId;
  }
  next();
});

app.post("/signin", async (req, res) => {
  //1. check if there is a user with that phone
  const { phone, password } = req.body;
  const user = await prisma.user.findFirst({
    where: { phone: { equals: phone } },
  });
  if (!user) {
    console.log(`No Such user is found for email ${phone}`);
    return res.send(404);
  }
  //2. check if password is correct
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    console.log("Invalid Password");
    return res.send(404);
  }
  //3. generate jwt token
  const secret: string = process.env.APP_SECRET as string;
  const token = jwt.sign({ userId: user.id }, secret);

  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 5,
  });

  res.send({
    name: user.name,
    phone: user.phone,
    amount: user.amount,
  });
});

app.post("/signup", async (req, res, next) => {
  const { name, phone, password } = req.body;

  const userExists = await prisma.user.findFirst({
    where: { phone: { equals: phone } },
  });
  if (userExists) {
    console.log("user already exist");
    return res.send(404);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      phone,
      password: hashedPassword,
    },
  });
  //create the jwt token for the new user
  const secret: string = process.env.APP_SECRET || "";
  const token = jwt.sign({ userId: user.id }, secret, { expiresIn: "1500000" });

  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 5, //5 mins
  });

  res.send({
    name: user.name,
    phone: user.phone,
    amount: user.amount,
  });
});

app.post("/signout", async (req, res) => {
  res.clearCookie("token");
  res.send("goodbye");
});

interface MyUserRequest extends Request {
  user?: string;
  userId?: number;
}
app.get("/me", async (req: MyUserRequest, res) => {
  if (!req.userId) return res.sendStatus(401);

  const user = await prisma.user.findFirst({
    where: { id: { equals: req.userId } },
    select: {
      name: true,
      phone: true,
      amount: true,
    },
  });

  res.send(user);
});

app.post("/sendMoney", async (req: MyUserRequest, res) => {
  if (!req.userId) return res.sendStatus(401);

  const user = await prisma.user.findFirst({
    where: { id: { equals: req.userId } },
  });
  if (!user) return res.sendStatus(404);

  const { receiverPhone, amount } = req.body;
  if (!receiverPhone || !amount) {
    console.log("please add phone number and account");
    return res.send(500);
  }

  const receiver = await prisma.user.findFirst({
    where: { phone: { equals: receiverPhone } },
  });

  if (!receiver) {
    console.log("No user with this phone number");
    return res.send(500);
  }

  const userBalance = user?.amount as number;
  if (amount > userBalance) {
    console.log("Transfere amount is greater than your balance!");
    return res.send(500);
  }

  await prisma.user.update({
    data: {
      amount: {
        increment: amount,
      },
    },
    where: { id: receiver?.id },
  });

  const ourNewUser = await prisma.user.update({
    data: {
      amount: {
        decrement: amount,
      },
    },
    where: { id: user?.id },
    select: {
      name: true,
      phone: true,
      amount: true,
    },
  });

  await prisma.transaction.create({data:{
    amount,
    senderId: user.id,
    receiverId: receiver.id,
  }})

  res.send(ourNewUser);
});

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}.`);
});

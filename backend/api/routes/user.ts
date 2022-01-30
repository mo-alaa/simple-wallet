import express from "express";
const router = express.Router();
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
const prisma = require("../../prisma/index");

import { MyUserRequest } from "../../models/interfaces";
import { auth } from "../middlewares/auth";

router.post("/signup", async (req, res, next) => {
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

  res.status(200).json({
    message: "Signed up successfully",
    data: {
      name: user.name,
      phone: user.phone,
      amount: user.amount,
    },
  });
});

router.post("/signin", async (req, res, next) => {
  //1. check if there is a user with that phone
  const { phone, password } = req.body;
  const user = await prisma.user.findFirst({
    where: { phone: { equals: phone } },
  });
  if (!user) {
    console.log(`No Such user is found for phone ${phone}`);
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

  res.status(200).json({
    message: "Signed in successfully",
    data: {
      name: user.name,
      phone: user.phone,
      amount: user.amount,
    },
  });
});

router.post("/signout", async (req, res, next) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Goodbye!" });
});

router.get("/current", auth, async (req: MyUserRequest, res, next) => {
  if (!req.userId) return res.status(401).json({ message: "Please Sign in!" });

  const user = await prisma.user.findFirst({
    where: { id: { equals: req.userId } },
    select: {
      name: true,
      phone: true,
      amount: true,
    },
  });

  res.status(200).json({
    message: "current user data",
    data: user,
  });
});

module.exports = router;

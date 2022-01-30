import express  from "express";
const router = express.Router();
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
const prisma = require('../../prisma/index')
import {MyUserRequest} from '../../models/interfaces';
import { auth } from "../middlewares/auth";



router.post("/sendMoney",auth, async (req: MyUserRequest, res, next) => {
  if (!req.userId) return res.status(401).json({ message: "Please Sign in!" });

  const user = await prisma.user.findFirst({
    where: { id: { equals: req.userId } },
  });
  if (!user) return res.sendStatus(404);

  const { receiverPhone, amount } = req.body;
  if (!receiverPhone || !amount) {
    console.log("incorrect phone number and/or ammount");
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

  res.status(200).json({
    message: 'Successful Transaction',
    data: {...ourNewUser}
  });
});

module.exports = router;
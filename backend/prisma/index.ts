import { PrismaClient } from "@prisma/client";
// import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { User } from "../models/User";

const prisma = new PrismaClient();

export async function signup(name: string, password: string, phone: string): Promise<User> {
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      phone, 
      password: hashedPassword,
    },
  });

  //create the jwt token for the new user
  // const secret: string = process.env.APP_SECRET || "";
  // const token = jwt.sign({ userId: user.id }, secret, { expiresIn: "5m" });
  return new User(user.name, user.phone, user.amount, '1234');
}

export async function signin(phone: string, password: string): Promise<User> {
  //1. check if there is a user with that phone
  const user = await prisma.user.findFirst({where: { phone: { equals: phone } },});
  if (!user) throw new Error(`No Such user is found for email ${phone}`);
 
  //2. check if password is correct
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Invalid Password");
 
  //3. generate jwt token
  // const secret: string = process.env.APP_SECRET || "";
  // const token = jwt.sign({ userId: user.id }, secret, { expiresIn: "120" });

  return new User(user.name, user.phone,user.amount, '123');
}

async function main() {
  // const password = await bcrypt.hash('123456', 10);

  // await prisma.user.create({
  //   data: {
  //     name: "mo alaaaa",
  //     phone: "0122333444",
  //     password
  //   },
  // });
  const allUsers = await prisma.user.findMany({
    select: {
      name: true,
      phone: true,
      password: true
    },
  });
  console.log(allUsers);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

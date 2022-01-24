import { User } from "./models";
import {endpoint, prodEndpoint} from './config'

const backendUri = process.env.NODE_ENV === "development" ? endpoint : prodEndpoint;

export async function getCurrentUser(): Promise<User | undefined> {
  const url = `${backendUri}/me`;
  try {
    const response = await fetch(url, { credentials: "include" });
    if (response) {
      const data = await response.json();

      if (data.phone && data.name && data.amount) {
        const loggedUser: User = {
          name: data.name,
          phone: data.phone,
          amount: data.amount,
        };
        return loggedUser;
      }
    }
  } catch (error) {
    console.log(error);
  }

  return undefined;
}

export async function sendMoney(
  receiverPhone: string,
  amount: number
): Promise<User | undefined> {
  const url = `${backendUri}/sendMoney`;

  try {
    const response = await fetch(url, {
      method: "post",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ receiverPhone, amount }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.phone && data.name && data.amount) {
        const loggedUser: User = {
          name: data.name,
          phone: data.phone,
          amount: data.amount,
        };
        return loggedUser;
      }
    }
  } catch (error) {
    console.log(error);
  }

  return undefined;
}

export async function signIn(
  phone: string,
  password: string
): Promise<User | undefined> {
  const url = `${backendUri}/signin`;
  console.log(url)
  const response = await fetch(url, {
    method: "post",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ phone, password }),
  });

  if (response.ok) {
    const data = await response.json();

    if (data.phone && data.name && data.amount) {
      const loggedUser: User = {
        name: data.name,
        phone: data.phone,
        amount: data.amount,
      };
      return loggedUser;
    }
  }
  return undefined;
}

export async function signUp(
  name: string,
  phone: string,
  password: string
): Promise<User | undefined> {
  const url = `${backendUri}/signup`;

  try {
    const response = await fetch(url, {
      method: "post",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, phone, password }),
    });

    const data = await response.json();
    if (response.ok) {
      if (data.phone && data.name && data.amount) {
        const loggedUser: User = {
          name: data.name,
          phone: data.phone,
          amount: data.amount,
        };
        return loggedUser;
      }
    }
  } catch (error) {
    console.log(error);
  }

  return undefined;
}

export async function signOut() {
  const url = `${backendUri}/signout`;

  await fetch(url, {
    method: "post",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
}

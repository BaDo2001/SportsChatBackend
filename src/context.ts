import type { User } from "@prisma/client";
import axios from "axios";
import NodeCache from "node-cache";

export type Context = {
  user?: User;
};

type Auth0User = {
  sub: string;
  email: string;
  picture: string;
};

const authCache = new NodeCache({
  stdTTL: 60,
  checkperiod: 120,
});

export const getContext = async (token?: string): Promise<Context> => {
  try {
    if (!token) {
      return {};
    }

    if (authCache.has(token)) {
      return authCache.get(token)!;
    }

    const { data } = await axios.get<Auth0User>(
      `${process.env.AUTH0_DOMAIN}/userinfo`,
      {
        headers: {
          Authorization: token,
        },
      },
    );

    const context = {
      user: {
        id: data.sub,
        email: data.email,
        avatar: data.picture,
      },
    };

    authCache.set(token, context);

    return context;
  } catch (error) {
    console.error(error);

    return {};
  }
};

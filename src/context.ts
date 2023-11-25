import type { User } from "@prisma/client";
import axios from "axios";

export type Context = {
  user?: User;
};

type Auth0User = {
  sub: string;
  email: string;
  picture: string;
};

export const getContext = async (token: string): Promise<Context> => {
  try {
    const { data } = await axios.get<Auth0User>(
      `${process.env.AUTH0_DOMAIN}/userinfo`,
      {
        headers: {
          Authorization: token,
        },
      },
    );

    return {
      user: {
        id: data.sub,
        email: data.email,
        avatar: data.picture,
      },
    };
  } catch (error) {
    console.error(error);

    return {};
  }
};

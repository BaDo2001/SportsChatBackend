import type { User } from "@prisma/client";
import { injectable } from "inversify";

import { prisma } from "@/db";

@injectable()
export default class UserService {
  async savePushToken(user: User, token: string) {
    await prisma.pushToken.upsert({
      where: {
        token,
      },
      update: {},
      create: {
        token,
        user: {
          connectOrCreate: {
            where: {
              id: user.id,
            },
            create: user,
          },
        },
      },
    });
  }

  async removePushToken(user: User, token: string) {
    await prisma.pushToken.delete({
      where: {
        token,
        userId: user.id,
      },
    });
  }
}

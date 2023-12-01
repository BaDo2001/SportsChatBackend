import type { User } from "@prisma/client";
import { injectable } from "inversify";

import { prisma } from "@/db";
import type Message from "@/types/Message";
import type { MessageInput } from "@/types/Message";

@injectable()
export default class MessageService {
  public async getMessages(matchId: number): Promise<Message[]> {
    return prisma.message.findMany({
      where: {
        matchId,
      },
      include: {
        author: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  public async addMessage(
    message: MessageInput,
    author: User,
    matchId: number,
  ): Promise<Message> {
    return prisma.message.create({
      data: {
        text: message.text,
        author: {
          connectOrCreate: {
            where: {
              id: author.id,
            },
            create: author,
          },
        },
        match: {
          connect: {
            id: matchId,
          },
        },
      },
      include: {
        author: true,
      },
    });
  }
}

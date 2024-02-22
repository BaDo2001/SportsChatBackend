import type { User } from "@prisma/client";
import { injectable } from "inversify";

import { prisma } from "@/db";
import firebase from "@/firebase";
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
    const savedMessage = await prisma.message.create({
      data: {
        text: message.text,
        elapsed: message.elapsed,
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

    const groupMembers = await prisma.groupMember.findMany({
      where: {
        matchId,
        userId: {
          not: author.id,
        },
      },
      select: {
        userId: true,
      },
    });

    const tokens = (
      await prisma.pushToken.findMany({
        where: {
          userId: {
            in: groupMembers.map((gm) => gm.userId),
          },
        },
        select: {
          token: true,
        },
      })
    )
      .map((t) => t.token)
      .reduce<string[][]>((acc, token) => {
        if (acc.length === 0 || acc[acc.length - 1].length >= 500) {
          acc.push([]);
        }

        acc[acc.length - 1].push(token);

        return acc;
      }, []);

    await Promise.all(
      tokens.map((tokenGroup) =>
        firebase.messaging().sendEachForMulticast({
          notification: {
            title: `${author.email} sent a message`,
            body: message.text,
          },
          tokens: tokenGroup,
        }),
      ),
    );

    return savedMessage;
  }

  public async isGroupMember(matchId: number, user: User) {
    const match = await prisma.match.findUnique({
      where: {
        id: matchId,
        groupMembers: {
          some: {
            userId: user.id,
          },
        },
      },
    });

    return !!match;
  }

  public async getGroups(user: User) {
    const groups = await prisma.groupMember.findMany({
      where: {
        userId: user.id,
      },
      include: {
        match: {
          include: {
            messages: {
              orderBy: {
                createdAt: "desc",
              },
              take: 1,
              include: {
                author: true,
              },
            },
            homeTeam: true,
            awayTeam: true,
            competition: true,
          },
        },
      },
    });

    return groups.map((group) => ({
      match: group.match,
      lastMessage: group.match.messages[0],
    }));
  }

  public async joinGroup(matchId: number, user: User) {
    await prisma.groupMember.create({
      data: {
        user: {
          connectOrCreate: {
            where: {
              id: user.id,
            },
            create: user,
          },
        },
        match: {
          connect: {
            id: matchId,
          },
        },
      },
    });
  }

  public async leaveGroup(matchId: number, user: User) {
    await prisma.groupMember.deleteMany({
      where: {
        userId: user.id,
        matchId,
      },
    });
  }
}

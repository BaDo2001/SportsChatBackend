import {
  Arg,
  Authorized,
  Ctx,
  Int,
  Mutation,
  PubSub,
  PubSubEngine,
  Query,
  Resolver,
  Root,
  Subscription,
  UseMiddleware,
} from "type-graphql";

import { lazyInject } from "@/container";
import { Context } from "@/context";
import GroupMembershipMiddleware from "@/middleware/groupMembershipMiddleware";
import MessageService from "@/services/MessageService";
import { Group, IsGroupMemberResponse } from "@/types/GroupMembership";
import Message, { MessageInput } from "@/types/Message";

export const SEND_MESSAGE_TOPIC = (matchId: number) =>
  `SEND_MESSAGE_${matchId}`;

@Resolver()
export default class MessageResolver {
  @lazyInject(MessageService)
  messageService: MessageService;

  @UseMiddleware(GroupMembershipMiddleware)
  @Query(() => [Message])
  async messages(
    @Arg("matchId", () => Int) matchId: number,
  ): Promise<Message[]> {
    return this.messageService.getMessages(matchId);
  }

  @Authorized()
  @UseMiddleware(GroupMembershipMiddleware)
  @Mutation(() => Boolean)
  async sendMessage(
    @Arg("message", () => MessageInput) input: MessageInput,
    @Arg("matchId", () => Int) matchId: number,
    @Ctx() ctx: Context,
    @PubSub() pubSub: PubSubEngine,
  ) {
    const message = await this.messageService.addMessage(
      input,
      ctx.user!,
      matchId,
    );

    await pubSub.publish(SEND_MESSAGE_TOPIC(matchId), message);

    return true;
  }

  @Authorized()
  @UseMiddleware(GroupMembershipMiddleware)
  @Subscription(() => Message, {
    topics: ({ args }) => SEND_MESSAGE_TOPIC(args.matchId),
  })
  newMessage(
    @Arg("matchId", () => Int) _matchId: number,
    @Root() message: Message,
  ): Message {
    return message;
  }

  @Authorized()
  @Query(() => IsGroupMemberResponse)
  async isGroupMember(
    @Arg("matchId", () => Int) matchId: number,
    @Ctx() ctx: Context,
  ): Promise<IsGroupMemberResponse> {
    const isMember = await this.messageService.isGroupMember(
      matchId,
      ctx.user!,
    );

    return { isMember };
  }

  @Authorized()
  @Query(() => [Group])
  async groups(@Ctx() ctx: Context): Promise<Group[]> {
    const groups = await this.messageService.getGroups(ctx.user!);

    return groups;
  }

  @Authorized()
  @Mutation(() => IsGroupMemberResponse)
  async joinGroup(
    @Arg("matchId", () => Int) matchId: number,
    @Ctx() ctx: Context,
  ): Promise<IsGroupMemberResponse> {
    await this.messageService.joinGroup(matchId, ctx.user!);

    return {
      isMember: true,
    };
  }

  @Authorized()
  @Mutation(() => IsGroupMemberResponse)
  async leaveGroup(
    @Arg("matchId", () => Int) matchId: number,
    @Ctx() ctx: Context,
  ): Promise<IsGroupMemberResponse> {
    await this.messageService.leaveGroup(matchId, ctx.user!);

    return {
      isMember: false,
    };
  }
}

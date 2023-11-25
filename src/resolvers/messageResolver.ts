import {
  Arg,
  Authorized,
  Ctx,
  Mutation,
  PubSub,
  PubSubEngine,
  Query,
  Resolver,
  Root,
  Subscription,
} from "type-graphql";

import { lazyInject } from "@/container";
import { Context } from "@/context";
import MessageService from "@/services/MessageService";
import Message, { MessageInput } from "@/types/Message";

@Resolver()
export default class MessageResolver {
  @lazyInject(MessageService)
  messageService: MessageService;

  @Query(() => [Message])
  async messages(
    @Arg("matchId", () => String) matchId: string,
  ): Promise<Message[]> {
    return this.messageService.getMessages(matchId);
  }

  @Authorized()
  @Mutation(() => Boolean)
  async sendMessage(
    @Arg("message", () => MessageInput) input: MessageInput,
    @Arg("matchId", () => String) matchId: string,
    @Ctx() ctx: Context,
    @PubSub() pubSub: PubSubEngine,
  ) {
    const message = await this.messageService.addMessage(
      input,
      ctx.user!,
      matchId,
    );
    await pubSub.publish(matchId, message);

    return true;
  }

  @Subscription(() => Message, {
    topics: ({ args }) => args.matchId,
  })
  newMessage(
    @Arg("matchId", () => String) _matchId: string,
    @Root() message: Message,
  ): Message {
    return message;
  }
}

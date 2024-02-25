import type { MiddlewareInterface, ResolverData } from "type-graphql";

import { lazyInject } from "@/container";
import type { Context } from "@/context";
import MessageService from "@/services/MessageService";

export default class GroupMembershipMiddleware
  implements MiddlewareInterface<Context>
{
  @lazyInject(MessageService)
  messageService: MessageService;

  async use({ context, args }: ResolverData<Context>, next: () => unknown) {
    const matchId = args["matchId"] as string | undefined;

    if (matchId === undefined) {
      console.error("Match id is required");
      throw new Error("Match id is required");
    }

    const isGroupMember = await this.messageService.isGroupMember(
      parseInt(matchId, 10),
      context.user!,
    );

    if (!isGroupMember) {
      throw new Error("Not a group member");
    }

    return next();
  }
}

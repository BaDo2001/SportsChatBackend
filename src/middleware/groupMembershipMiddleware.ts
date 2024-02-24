import type { MiddlewareInterface, ResolverData } from "type-graphql";

import { lazyInject } from "@/container";
import type { Context } from "@/context";
import MessageService from "@/services/MessageService";

export default class GroupMembershipMiddleware
  implements MiddlewareInterface<Context>
{
  @lazyInject(MessageService)
  messageService: MessageService;

  async use({ context }: ResolverData<Context>, next: () => unknown) {
    const isGroupMember = await this.messageService.isGroupMember(
      1,
      context.user!,
    );

    if (!isGroupMember) {
      throw new Error("Not a group member");
    }

    return next();
  }
}

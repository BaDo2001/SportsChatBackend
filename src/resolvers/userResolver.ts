import { Arg, Authorized, Ctx, Mutation } from "type-graphql";

import { lazyInject } from "@/container";
import { Context } from "@/context";
import UserService from "@/services/UserService";
import User from "@/types/User";

export default class UserResolver {
  @lazyInject(UserService)
  userService: UserService;

  @Authorized()
  @Mutation(() => User)
  async savePushToken(
    @Arg("token", () => String) token: string,
    @Ctx() ctx: Context,
  ): Promise<User> {
    await this.userService.savePushToken(ctx.user!, token);

    return ctx.user!;
  }

  @Authorized()
  @Mutation(() => User)
  async removePushToken(
    @Arg("token", () => String) token: string,
    @Ctx() ctx: Context,
  ): Promise<User> {
    await this.userService.removePushToken(ctx.user!, token);

    return ctx.user!;
  }
}

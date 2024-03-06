import { Container } from "inversify";
import getDecorators from "inversify-inject-decorators";

import MatchService from "./services/MatchService";
import MessageService from "./services/MessageService";
import UserService from "./services/UserService";

export const container = new Container({
  defaultScope: "Singleton",
});
container.bind<MatchService>(MatchService).to(MatchService);
container.bind<MessageService>(MessageService).to(MessageService);
container.bind<UserService>(UserService).to(UserService);

export const { lazyInject } = getDecorators(container);

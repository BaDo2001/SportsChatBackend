import { Container } from "inversify";
import getDecorators from "inversify-inject-decorators";

import GamesService from "./services/GamesService";
import MessageService from "./services/MessageService";
import UserService from "./services/UserService";

export const container = new Container({
  defaultScope: "Singleton",
});
container.bind<GamesService>(GamesService).to(GamesService);
container.bind<MessageService>(MessageService).to(MessageService);
container.bind<UserService>(UserService).to(UserService);

export const { lazyInject } = getDecorators(container);

import { Container } from "inversify";
import getDecorators from "inversify-inject-decorators";

import GamesService from "./services/GamesService";
import MessageService from "./services/MessageService";
import UserService from "./services/UserService";

const container = new Container();
container.bind<GamesService>(GamesService).to(GamesService);
container.bind<MessageService>(MessageService).to(MessageService);
container.bind<UserService>(UserService).to(UserService);

export const { lazyInject } = getDecorators(container);

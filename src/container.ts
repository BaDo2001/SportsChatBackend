import { Container } from "inversify";
import getDecorators from "inversify-inject-decorators";

import GamesService from "./services/GamesService";
import MessageService from "./services/MessageService";

const container = new Container();
container.bind<GamesService>(GamesService).to(GamesService);
container.bind<MessageService>(MessageService).to(MessageService);

export const { lazyInject } = getDecorators(container);

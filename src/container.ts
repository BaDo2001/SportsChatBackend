import { Container } from "inversify";
import getDecorators from "inversify-inject-decorators";

import GamesService from "./services/GamesService";

const container = new Container();
container.bind<GamesService>(GamesService).to(GamesService);

export const { lazyInject } = getDecorators(container);

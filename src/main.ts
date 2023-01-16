import { ActivityTypes, createBot, startBot } from "discordeno/mod.ts";
import {
  enableCachePlugin,
  enableCacheSweepers,
  fastFileLoader,
} from "discordeno/plugins/mod.ts";
import { getAppId, getToken } from "denobot";
import { logger } from "./utils/logger.ts";
import { events } from "./events/mod.ts";
import { updateCommands } from "./utils/helpers.ts";

const log = logger({ name: "Main" });
const paths = ["./events", "./commands"];

log.info("Starting Bot, this might take a while...");

await fastFileLoader(paths).catch((err) => {
  log.fatal(`Unable to Import ${paths}`);
  log.fatal(err);

  Deno.exit(1);
});

export const bot = enableCachePlugin(
  createBot({
    token: getToken(),
    botId: getAppId(),
    intents: [],
    events,
  })
);

enableCacheSweepers(bot);

bot.gateway.presence = {
  status: "online",
  activities: [
    {
      name: "Built with Discordeno and Running with Botway",
      type: ActivityTypes.Game,
      createdAt: Date.now(),
    },
  ],
};

await startBot(bot);

await updateCommands(bot);

import { Client, Collection, Events, GatewayIntentBits, MessageFlags } from 'discord.js'
// import { config } from 'dotenv'
import { deployCommands, deployEvents } from './handler.js'

// config();
const	client = new Client({ intents: [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMembers,
	GatewayIntentBits.GuildMessages
] });

client.commands = new Collection();
deployCommands(client);
deployEvents(client);

client.login(process.env.TOKEN);

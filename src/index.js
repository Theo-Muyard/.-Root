import { Client, Collection, Events, GatewayIntentBits, MessageFlags } from 'discord.js'
import { config } from 'dotenv'
import { deployCommands, deployEvents } from './handler.js'
import mongoose from 'mongoose';

config();
const	client = new Client({ intents: [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMembers,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.MessageContent
] });

(async () => {
	try
	{
		await mongoose.connect(process.env.MONGO_URI);
		console.log('The DB is ready.');
	}
	catch(error)
	{
		console.error('An error with DB was found.', error);
	}
})();

client.commands = new Collection();
deployCommands(client);
deployEvents(client);

client.login(process.env.TOKEN);

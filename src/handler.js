import fs from 'fs'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import { REST, Routes } from 'discord.js'
import { config } from 'dotenv'

config();
const	commands = [];
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const	commandsHandler = async (client) => {
	const	foldersPath = path.join(__dirname, 'commands');
	const	commandsFolder = fs.readdirSync(foldersPath);

	for (const folder of commandsFolder)
	{
		const	commandsPath = path.join(foldersPath, folder);
		const	commandsFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

		for (const file of commandsFiles)
		{
			const	filePath = path.join(commandsPath, file);
			const	fileUrl = pathToFileURL(filePath).href;
			const	command = await import(fileUrl);

			if ('data' in command.default && 'execute' in command.default)
			{
				commands.push(command.default.data.toJSON());
				client.commands.set(command.default.data.name, command.default);
				console.log("New command registered.")
			}
			else
			{
				console.log(`[WARNING] The command at ${filePath} is missing arguments.`)
			}
		}
	}
}

const rest = new REST().setToken(process.env.TOKEN);

export const	deployCommands = async (client) => {
	await commandsHandler(client);
	try
	{
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const data = await rest.put(
			Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	}
	catch (error)
	{
		console.error(error);
	}
}

export const deployEvents = async (client) => {
	const eventsPath = path.join(__dirname, 'events');
	const eventsFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

	for (const file of eventsFiles)
	{
		const	filePath = path.join(eventsPath, file);
		const	fileUrl = pathToFileURL(filePath).href;
		const	event = await import(fileUrl);

		if (event.default.name && event.default.execute)
		{
			if (event.default.once)
			{
				client.once(event.default.name, (...args) => event.default.execute(...args, client));
			}
			else
			{
				client.on(event.default.name, (...args) => event.default.execute(...args, client));
			}
		}
		else
		{
			console.log(`[WARNING] The event at ${filePath} is missing arguments.`);
		}
	}
}

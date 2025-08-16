import { Events } from 'discord.js'
import { config } from 'dotenv'

config();

export default {
	name: Events.GuildMemberRemove,
	once: false,
	async execute(member)
	{
		const userMessages = [
			`Error 404: <@${member.user.id}> not found in server.`,
			`System log: <@${member.user.id}> has left the project. Commit history will remember them.`,
			`Goodbye, <@${member.user.id}>! Your session has ended.`,
			`Warning: <@${member.user.id}> has exited the program.`,
			`Warning: <@${member.user.id}> has quit the server. Productivity may decrease!`,
			`Debugger output: <@${member.user.id}> has exited with code 0.`,
			`System ping: No response... <@${member.user.id}> is gone.`,
		]

		const	botMessages = [
			`Shutdown sequence complete. Bot <@${member.user.id}> has exited.`,
			`Process terminated: <@${member.user.id}> stopped running.`,
			`Error log: Bot <@${member.user.id}> not found in this server anymore.`,
			`Alert: <@${member.user.id}> executed command "leave()" successfully.`
		];

		if (member.user.bot)
		{
			const randomIndex = Math.floor(Math.random() * botMessages.length);
			await member.client.channels.cache.get(process.env.CHAT_CHANNEL_ID).send(botMessages[randomIndex]);
		}
		else
		{
			const randomIndex = Math.floor(Math.random() * userMessages.length);
			await member.client.channels.cache.get(process.env.CHAT_CHANNEL_ID).send(userMessages[randomIndex]);
		}
	}
}

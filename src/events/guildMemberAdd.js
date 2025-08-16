import { Events } from 'discord.js'
import { config } from 'dotenv'

config();

export default {
	name: Events.GuildMemberAdd,
	once: false,
	async execute(member)
	{
	const userMessages = [
			`Hey <@${member.user.id}>, glad you joined us! We're excited to code, learn and share with you !`,
			`System log: New programmer detected, <@${member.user.id}> has entered the chat.`,
			`Welcome <@${member.user.id}>! Your coding journey starts here. Let's make it epic!`,
			`Compiling… Done >_ <@${member.user.id}> has joined our coding crew!`,
			`Hello, World! <@${member.user.id}> just joined the server.`,
			`Welcome aboard, <@${member.user.id}>! Ready to debug the universe?`,
			`Warning: <@${member.user.id}> just spawned in the server, Don't forget to say hi!`
		]

		const	botMessages = [
  		  `Beep boop <@${member.user.id}>! Welcome to the server, fellow bot!`,
		  `Hello <@${member.user.id}>! Ready to automate some tasks together?`,
		  `Welcome <@${member.user.id}>! Let's make this server smarter!`,
		  `Hi <@${member.user.id}>, excited to have another bot on board!`,
		];

		if (member.user.bot)
		{
			const randomIndex = Math.floor(Math.random() * botMessages.length);
			await member.client.channels.cache.get(process.env.CHAT_CHANNEL_ID).send(botMessages[randomIndex]);
		}
		else
		{
			const randomIndex = Math.floor(Math.random() * userMessages.length);
			await member.client.channels.cache.get(userMessages[randomIndex]).send(userMessages[randomIndex]);
		}
	}
}

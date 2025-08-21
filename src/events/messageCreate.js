import { Events } from 'discord.js'
import { config } from 'dotenv'
import { xpSystem } from '../tools/xpSystem.js'

config();

export default {
	name: Events.MessageCreate,
	once: false,
	async execute(message)
	{
		const	user = message.member.user;
		const	DISBOARD_ID = '302050872383242240';


		const embed = message.embeds[0];
		const description = embed?.description || embed?.data?.description;

		if (description && description.includes("Bump effectué")) {
			message.channel.send(`${process.env.LOVE_EMOJI} Thank you for voting!`);

			setTimeout(() => {
				const channel = message.guild.channels.cache.get(process.env.CHAT_CHANNEL_ID);
				if (channel) {
					channel.send(`${process.env.REMINDER_EMOJI} It's time to vote! Use \`/bump\` with <@${DISBOARD_ID}>.\n*Thanks to everyone who support us!*`);
				}
			}, 2 * 60 * 60 * 1000);
		}
		if (user.bot) return;
		xpSystem(user, message);
	}
}

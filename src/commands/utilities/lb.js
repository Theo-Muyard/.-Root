import { EmbedBuilder, MessageFlags, SlashCommandBuilder } from "discord.js"
import { config } from 'dotenv'
import userModel from '../../schemas/user.schema.js'

config();

export const cache = new Map();
export default {
	data: new SlashCommandBuilder()
			.setName('lb')
			.setDescription('Display the leaderboard'),

	async execute(interaction)
	{
		const	users = await userModel.find();

		const	sortedUsers = users?.sort((a, b) => b.stats.level - a.stats.level).slice(0, 10);
		let		viewUsersLB = ``;

		sortedUsers.forEach((user, index) => {
			let		afficher = `#${index+1}`;

			switch (index+1)
			{
				case 1:
					afficher = process.env.CUP_EMOJI;
					break;
				case 2:
					afficher = process.env.MDL2_EMOJI;
					break;
				case 3:
					afficher = process.env.MDL3_EMOJI;
					break
			}
			viewUsersLB += `${afficher} <@${user.id}> \`(lvl.${user.stats.level})\`\n`
		});

		const	lbEmbed = new EmbedBuilder()
			.setColor(process.env.BLUE_COLOR)
			.setTitle('Leaderboard')
			.setURL('https://discord.gg/fsDqnqQknR')
			.setDescription(viewUsersLB || 'No users found on the leaderboard.')
			.setThumbnail(interaction.guild.iconURL({ size: 1024 }))
			.setFooter({ text: 'This leaderboard contains the 10 people with the highest level.' })

		interaction.reply({
			embeds: [lbEmbed],
		})
	}
}

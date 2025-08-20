import { MessageFlags, SlashCommandBuilder } from "discord.js"
import { config } from 'dotenv'

config();

export default {
	moderator: true,
	data: new SlashCommandBuilder()
			.setName('clear')
			.setDescription('Delete {number} messages from the channel.')
			.addNumberOption(option => option.setName('number').setDescription('Number of messages to delate.').setRequired(true)),

	async execute(interaction)
	{
		const	number = interaction.options.getNumber('number');

		if (number < 1 || number > 100)
		{
			return interaction.reply({
				content: `${process.env.ERROR_EMOJI} You can only delete between 1 and 100 messages at once`,
				flags: MessageFlags.Ephemeral
			})
		}

		await interaction.deferReply({ flags: MessageFlags.Ephemeral });


		const	deleted = await interaction.channel.bulkDelete(number, true);
		interaction.editReply({
			content: `${process.env.CHECK_EMOJI} Deleted ${deleted.size} messages successfully.`,
			flags: MessageFlags.Ephemeral
		});
	}
}

import { MessageFlags, SlashCommandBuilder } from "discord.js"
import { config } from 'dotenv'
import userModel from '../../schemas/user.schema.js'
import { getProfilView } from '../../tools/profile/profile.theme.js'
import { buttonCollector } from '../../tools/profile/profile.collector.js'

config();

export const cache = new Map();

export default {
	data: new SlashCommandBuilder()
			.setName('profile')
			.setDescription('Displays your profile, or that of the person mentioned')
			.addUserOption(option => option.setName('user').setDescription('The user whose profile will be displayed').setRequired(false)),

	async execute(interaction)
	{
		const	user = interaction.options.getUser('user') || interaction.user;

		// BOT USER
		if (user.bot)
		{
			return interaction.reply({
				content: `${process.env.ERROR_EMOJI} [Error] This user is a bot.`,
				flags: MessageFlags.Ephemeral
			})
		}
		try
		{
			const	userDB = await userModel.findOne({ id: user.id });

			if (!userDB && user !== interaction.user)
			{
				return interaction.reply({
					content: `${process.env.ERROR_EMOJI} [Error] This user is'nt in DB.`,
					flags: MessageFlags.Ephemeral
				});
			}
			// USER IS'NT IN DB
			if (!userDB)
			{
				await interaction.deferReply({ flags: MessageFlags.Ephemeral });
				const newUserDB = new userModel({ id: user.id });
				await newUserDB.save();
				return interaction.editReply({
					content: `${process.env.CHECK_EMOJI} [SUCCESS] The user DB has been successfully created.`,
					flags: MessageFlags.Ephemeral
				});
			}
			const	profilToSend = await getProfilView(user, userDB, interaction);

			await interaction.reply(profilToSend);
			const	message = await interaction.fetchReply();

			cache.set(interaction.user.id, message);
			buttonCollector(message, interaction);
		}
		catch (error)
		{
			console.error(error);
			if (interaction.deferred || interaction.replied) {
				return interaction.editReply({
					content: 'An error was found.',
					flags: MessageFlags.Ephemeral,
				});
			} else {
				return interaction.reply({
					content: 'An error was found.',
					flags: MessageFlags.Ephemeral,
				});
			}
		}
	}
}

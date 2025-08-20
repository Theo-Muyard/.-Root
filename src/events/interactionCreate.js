import { Events, MessageFlags } from 'discord.js'
import { config } from 'dotenv'
import userModel from '../schemas/user.schema.js';
import { cache } from '../commands/utilities/profil.js'
import { getProfilView } from '../tools/profil/profil.theme.js';

config();
export default {
	name: Events.InteractionCreate,
	once: false,
	async execute(interaction)
	{
		if (interaction.isModalSubmit())
		{
			if (interaction.customId === 'edit-profil-description-modal')
			{
				const	description = interaction.fields.getTextInputValue('edit-profil-description-input');
				try
				{
					await userModel.findOneAndUpdate({ id: interaction.user.id }, { description })
					interaction.reply({
						content: `${process.env.CHECK_EMOJI} Your profile has been successfully updated.`,
						flags: MessageFlags.Ephemeral
					})

					const message = cache.get(interaction.user.id);

					if (message) {
						const userDB = await userModel.findOne({ id: interaction.user.id });
						const updatedProfil = await getProfilView(interaction.user, userDB, interaction);

						await message.edit(updatedProfil);
					}
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

		if (!interaction.isChatInputCommand()) return;

			const	command = interaction.client.commands.get(interaction.commandName);

			if (command) {
				try
				{
					if (command.moderator && !interaction.member.permissions.has('ManageMessages'))
					{
						return interaction.reply({ content: `${process.env.ERROR_EMOJI} You don't have the necessary permissions to do that!`, flags: MessageFlags.Ephemeral})
					}
					await command.execute(interaction);
				}
				catch (error) {
					console.error(error);
					if (interaction.replied || interaction.deferred)
					{
						await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
					}
					else
					{
						await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
					}
				}
			}
	}
}

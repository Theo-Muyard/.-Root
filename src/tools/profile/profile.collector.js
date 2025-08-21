import { config } from 'dotenv'
import { getDescriptionModal } from '../../tools/profile/profile.theme.js'
import { ActionRowBuilder, ComponentType, ButtonBuilder } from 'discord.js';

config();

export async function buttonCollector(message, interaction)
{
	const	collector = message.createMessageComponentCollector({
		filter: i => i.user.id === interaction.user.id,
		time: 100_000
	})

	collector.on('collect', async (i) => {
		if (i.customId === 'close-profil')
			{
				collector.stop('close');
				return i.update({
					content: `${process.env.CLOSE_EMOJI} The profile has been closed by the author.`,
					embeds: [],
					components: [],
					files: [],
				})
			}
		if (i.customId === 'edit-profil')
		{
			const	modal = getDescriptionModal()
			await i.showModal(modal);
		}
	})

	collector.on('end', async (_collected, reason) => {
		if (reason === 'close') return;
		try {
			const	rows = message.components.map(row => {
				const	newRow = new ActionRowBuilder();

				for (const comp of row.components)
				{
					if (comp.type === ComponentType.Button)
					{
						const btn = ButtonBuilder.from(comp);
						btn.setDisabled(true);
						newRow.addComponents(btn);
					}
				}
				return newRow;
			});
			await message.edit({ components: rows });
		}
		catch (e)
		{
			console.error('Failed to disable buttons:', e);
		}
	});
}

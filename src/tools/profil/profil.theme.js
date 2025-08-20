import getCanva from "./profil.canvas.js";
import { config } from "dotenv";
import { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js'

config();
const languageRoles = {
    "1406010526051340419": "<:c_:1406003153328934922>",        // C
    "1406010570255106088": "<:cpp:1406003057220780173>",       // C++
    "1406010607244935188": "<:csharp:1406003318660272138>",   // C#
    "1406022153463140412": "<:brainfuck:1406021885388394727>",// Brainfuck
    "1323233344120557669": "<:java:1405955273910124686>",      // Java
    "1323232033442500658": "<:js:1406003628623396874>",        // JS
    "1406010696092614718": "<:ts:1406003797557379132>",       // TS
    "1323231598090522625": "<:html:1406003876217225310>",      // HTML
    "1406011121973858324": "<:css:1406003977824243722>",       // CSS
    "1323232138296037437": "<:php:1405958147788771399>",       // PHP
    "1323232691142787192": "<:python:1405953526827319327>",    // Python
    "1406022256609722448": "<:lua:1406021137481338982>",       // Lua
    "1406022314134601798": "<:sql:1406020530900832256>",       // SQL
    "1323233104084602981": "<:nodejs:1406008916294373416>"     // NodeJS
};

export async function getProfilView(user, userDB, interaction)
{
	const	canvas = await getCanva(userDB);
	const	attachment = canvas.toBuffer();

	const	guild = interaction.guild;
	const	member = guild.members.cache.get(user.id);

	const memberLanguages = member.roles.cache
		.filter(role => languageRoles[role.id])
		.sort((a, b) => b.position - a.position)
		.map(role => languageRoles[role.id]);

	const	profilEmbed = new EmbedBuilder()
		.setColor(process.env.BLUE_COLOR)
		.setTitle(`${user.username}'s Profil`)
		.setURL('https://discord.gg/fsDqnqQknR')
		.setDescription(userDB.description)
		.setFields(
			{ name: 'Money', value: `${userDB.money}x ${process.env.MONEY_EMOJI}` },
			{ name: 'Languages', value: memberLanguages.length > 0 ? memberLanguages.join(' ') : 'None' }
		)
		.setThumbnail(user.avatarURL({ size: 1024 }))
		.setImage('attachment://profile.png');

	const	editButton = new ButtonBuilder()
		.setCustomId('edit-profil')
		.setLabel('Edit')
		.setEmoji('1406605609238790206')
		.setStyle(ButtonStyle.Secondary);

	const	closeButton = new ButtonBuilder()
		.setCustomId('close-profil')
		.setLabel('Close')
		.setEmoji('1406615744623415367')
		.setStyle(ButtonStyle.Danger);

	const	row = new ActionRowBuilder()
		.addComponents(editButton, closeButton);

	const	comp = user.id == interaction.user.id ? [row] : [];
	const	res = user.id == interaction.user.id ? true : false;

	return ({
		embeds: [profilEmbed],
		components: comp,
		files: [{ attachment, name: 'profile.png' }],
		withResponse: res,
	})
}

export function getDescriptionModal()
{
	const	modal = new ModalBuilder()
		.setCustomId('edit-profil-description-modal')
		.setTitle('Edit profil');

	const	descriptionInput = new TextInputBuilder()
		.setCustomId('edit-profil-description-input')
		.setLabel('Set new description')
		.setStyle(TextInputStyle.Paragraph);

	const	row = new ActionRowBuilder()
		.setComponents(descriptionInput);

	modal.addComponents(row)
	return modal;
}

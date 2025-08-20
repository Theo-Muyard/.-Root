import { Events } from 'discord.js'

function updatePresence(client) {
    const guild = client.guilds.cache.first();
    if (!guild) return;

    guild.members.fetch().then(members => {
        const totalMembers = members.size;
        const botCount = members.filter(m => m.user.bot).size;

        client.user.setPresence({
            activities: [{ name: `${totalMembers} members, with ${botCount} bots`, type: 3 }]
        });
    });

	return;
}

export default {
	name: Events.ClientReady,
	once: true,
	execute(client)
	{
		const	totalMembers = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);

		console.log(`The bot is ready. (${client.user.tag})`);
		setInterval(() => updatePresence(client), 1 * 60 * 1000);
	}
}

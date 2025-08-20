import userModel from '../schemas/user.schema.js'
import { config } from 'dotenv'

config();
export async function	xpSystem(user, message)
{
	if (user.bot) return;
		try
		{
			const	userDB = await userModel.findOne({ id: user.id });

			if (!userDB)
			{
				const	newUserDB = new userModel({ id: user.id });
				await newUserDB.save();
				return;
			}
			const	addXP = Math.floor(Math.random() * 20 + 5);
			const	actualXP = userDB.stats.xp;
			const	xpMax = userDB.stats.xpMax;

			if ((actualXP + addXP) >= xpMax)
			{
				const levelUpMessages = [
					`Congrats <@${user.id}>! You've just leveled up to **${userDB.stats.level + 1}**. Keep coding like a pro!`,
					`Nice work <@${user.id}>! Level **${userDB.stats.level + 1}** unlocked. Your commit history is looking strong!`,
					`<@${user.id}> you've hit level **${userDB.stats.level + 1}**! Debugging life one bug at a time!`,
					`Level **${userDB.stats.level + 1}** reached, <@${user.id}>! Your algorithms are evolving!`,
					`Boom <@${user.id}>! Welcome to level **${userDB.stats.level + 1}**. Keep pushing those commits!`
				];
				const randomIndex = Math.floor(Math.random() * levelUpMessages.length);

				await userModel.findOneAndUpdate({ id: user.id }, {
					$set: {
						"stats.xp": 0,
						"stats.xpMax": (userDB.stats.level + 1) * 50 + 300,
						"stats.level": userDB.stats.level + 1
					}
				})
				return message.channel.send(`${process.env.PARTY_EMOJI} ` + levelUpMessages[randomIndex]);
			}
			await userModel.findOneAndUpdate({ id: user.id }, { $inc: { "stats.xp": addXP } })
		} catch (error)
		{
			console.error(error)
		}
}

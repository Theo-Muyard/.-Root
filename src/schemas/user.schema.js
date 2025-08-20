import mongoose from 'mongoose';

const	userSchema = new mongoose.Schema({
	id: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		default: 'No description.',
	},
	stats: {
		xp: {
			type: Number,
			default: 0,
		},
		xpMax: {
			type: Number,
			default: 300,
		},
		level: {
			type: Number,
			default: 0,
		}
	},
	money: {
		type: Number,
		default: 5,
	}
})

export default mongoose.model('User', userSchema);

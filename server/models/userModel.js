const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		isDj: {
			type: Boolean,
			default: false,
		},
		isAdmin: {
			type: Boolean,
			default: false,
		},
		seenNotifications: {
			type: Array,
			default: [],
		},
		unseenNotifications: {
			type: Array,
			default: [],
		},
		profileImage: {
			type: String,
			default: false,
		},
		partyImages: {
			type: Array,
			default: [],
		},
		verified: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

const userModel = mongoose.model('users', userSchema);

module.exports = userModel;

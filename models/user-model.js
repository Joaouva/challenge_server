const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		username: { type: String, required: true },
		password: { type: String, required: true },
		name: { type: String },
		address: { type: String },
		email: { type: String, required: true, unique: true },
		googleId: String,
		menus: [{ type: Schema.Types.ObjectId, ref: "Menu" }],
	},
	{
		timestamps: true,
	}
);

const User = mongoose.model("User", userSchema);
module.exports = User;

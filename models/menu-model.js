const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const menuSchema = new Schema(
	{
		name: { type: String, required: true, unique: true },
		description: { type: String, required: true },
		price: { type: String, required: true },
		day: { type: String },
		type: { type: String },
		image: {type: String},
	},

	{
		timestamps: true,
	}
);

const Menu = mongoose.model("Menu", menuSchema);
module.exports = Menu;

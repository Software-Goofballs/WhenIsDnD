const { SlashCommandBuilder } = require('@discordjs/builders');
const { getGame, saveGame } = require('./../memory/mem-manager.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('cancel')
		.setDescription('Cancel the next game'),
	async execute(interaction) {
		let plan = await getGame();
		plan.cancelled = true;
		await saveGame(plan);
		
		return interaction.reply("Next game is cancelled");
	},
};

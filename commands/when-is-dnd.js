const { SlashCommandBuilder } = require('@discordjs/builders');
const { getGame, getPlayerInfo } = require('./../memory/mem-manager.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('when-is-dnd')
		.setDescription('Ask when D&D is'),
	async execute(interaction) {
		const plan = await getGame();
		const timeRequester = interaction.user.id;
		const playerTimeZone = await getPlayerInfo(timeRequester);
		const nextGame = await getGame();
		
		const dateOfPlay = new Date(nextGame.Date.replace('Z',playerTimeZone))
		
		let reply = `The next game is on ${dateOfPlay.toDateString()} at ${dateOfPlay.toLocaleTimeString()} in your time zone (${playerTimeZone})`;
		
		if (plan.cancelled) {
			reply = "D&D is cancelled this week"
		}
		
		return interaction.reply(reply);
	},
};

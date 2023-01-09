const { SlashCommandBuilder } = require('@discordjs/builders');
const { getGame, getPlayerInfo } = require('./../memory/mem-manager.js');

const zones = {
	"-05:00": "America/New_York",
	"-06:00": "America/Chicago",
	"-07:00": "America/Denver",
	"-08:00": "America/Los_Angeles"
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('when-is-dnd')
		.setDescription('Ask when D&D is')
		.addUserOption(option => option.setName('user').setDescription('Who are you askinf for?')),
	async execute(interaction) {
		const plan = await getGame();
		const timeRequester = interaction.options.getUser('user') || interaction.user.id;
		const playerTimeZone = await getPlayerInfo(timeRequester);
		const nextGame = await getGame();
		
		const dateOfPlay = new Date(nextGame.Date)
		
		let reply = `<@${timeRequester.id}>, the next game is on ${dateOfPlay.toLocaleString('en-US',{timeZone:zones[playerTimeZone]}).replace(',',' at')} in your time zone (${zones[playerTimeZone]})`;
		
		if (plan.cancelled) {
			reply = "D&D is cancelled this week"
		}
		
		return interaction.reply(reply);
	},
};

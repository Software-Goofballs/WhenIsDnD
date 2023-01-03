const { SlashCommandBuilder } = require('discord.js');
const { getGame, saveGame, getPlayerInfo } = require('./../memory/mem-manager.js');
const { dayOfPlay } = require("./../config.json");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('change-plan')
		.setDescription('Change info about DnD night')
		.addIntegerOption(option => 
			option.setName('day-of-play')
			.setDescription('What day are we playing on?')
			.addChoices(
				{ name: 'Monday', value: 0 },
				{ name: 'Tuesday', value: 1 },
				{ name: 'Wednesday', value: 2 },
				{ name: 'Thursday', value: 3 },
				{ name: 'Friday', value: 4 },
				{ name: 'Saturday', value: 5 },
				{ name: 'Sunday', value: 6 },
			)
		).addStringOption(option => 
			option.setName('time-of-play')
			.setDescription('When are we playin? (Military time)')
		).addBooleanOption(option => 
			option.setName('cancelled')
			.setDescription('Are we playing?')
		),
	async execute(interaction) {
		// Load inputs
		const newDayOfPlay = interaction.options.getInteger('day-of-play');
		const newTimeOfPlay = interaction.options.getString('time-of-play');
		const newCancelled = interaction.options.getBoolean('cancelled');
		
		let result = "Next game is updated"
		
		let plan = await getGame();
		
		if (newCancelled != undefined) {
			plan.cancelled = newCancelled;
		}
		let newDate = new Date(plan.Date);
		if (newDayOfPlay) {
			newDate.setUTCDate(newDate.getUTCDate() - newDate.getUTCDay() + newDayOfPlay);
		}
		if (newTimeOfPlay) {
			const timeRequester = interaction.user.id;
			const playerTimeZone = await getPlayerInfo(timeRequester);
			
			newDate = new Date(`${newDate.toISOString().split('T')[0]}T${newTimeOfPlay}:00.000${playerTimeZone}`)
		}
		
		if (!isNaN(newDate)) {
			plan.Date = newDate.toISOString();
		} else {
			result = "Error updating play time";
		}
		await saveGame(plan);
		
		return interaction.reply(result);
	},
};

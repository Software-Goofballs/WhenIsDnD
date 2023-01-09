const { SlashCommandBuilder } = require('@discordjs/builders');
const { getGame, getPlayerInfo } = require('./../memory/mem-manager.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('countdown')
		.setDescription('Ask "How Long till DnD?"'),
	async execute(interaction) {
		const plan = await getGame();
		const timeRequester = interaction.user.id;
		const playerTimeZone = await getPlayerInfo(timeRequester);
		const nextGame = await getGame();
		
		const dateOfPlay = new Date(nextGame.Date)
		const today = new Date()
		let timeDiff = Math.trunc((dateOfPlay.getTime()-today.getTime())/(1000)); // Seconds
		
		const days = Math.floor(timeDiff / (60*60*24));
		timeDiff -= days;
		const hours = Math.floor(timeDiff / (60*60));
		timeDiff -= hours;
		const minutes = Math.floor(timeDiff / 60);
		timeDiff -= minutes;
		
		let reply = `The next game is in ${days} days, ${hours} hours, and ${minutes} minutes`;
		
		if (plan.cancelled) {
			reply = "D&D is cancelled this week"
		}
		
		return interaction.reply(reply);
	},
};

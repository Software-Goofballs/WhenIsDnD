const { SlashCommandBuilder } = require('discord.js');
const { setPlayerInfo } = require('./../memory/mem-manager.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('set-my-time-zone')
		.setDescription('Set your time zone!')
		.addStringOption(option => 
			option.setName('time-zone')
			.setDescription('Your time zone')
			.setRequired(true)
			.addChoices(
				{ name: 'Pacific', value: '-08:00' },
				{ name: 'Mountain', value: '-07:00' },
				{ name: 'Central', value: '-06:00' },
				{ name: 'Eastern', value: '-05:00' },
			)
		),
	async execute(interaction) {
		const player = interaction.user.id;
		setPlayerInfo(player, interaction.options.getString('time-zone')); 
		return interaction.reply("Time Zone Changed!");
	},
};

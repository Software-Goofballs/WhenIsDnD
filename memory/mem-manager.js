const { dayOfPlay, timeOfPlay, defaultTimeZone } = require("./../config.json");
const fs = require('fs');
const path = require('path');
const memory = path.resolve(__dirname, "memory.json");

const loadData = async () => {
	try {
		return JSON.parse(fs.readFileSync(memory));
	} catch (e) {
		return {
			Games: [],
			PlayerTimeZones: {
				"Example_Player":"-05:00"
			}
		};
	}
}

const getNextDayOfWeek = () => {
	var resultDate = new Date();
	while (resultDate.getUTCDate() != dayOfPlay){
		resultDate.setUTCDate(resultDate.getUTCDate() + 1);
	}
	return `${resultDate.toISOString().split('T')[0]}T${timeOfPlay}:00.000${defaultTimeZone}`;
}

module.exports = { 
	async getGame() {
		let data = await loadData();
		const nextGame = data.Games[0];
		var today = new Date();
		today = today.toISOString().split('T')[0];
		
		if (nextGame == undefined || nextGame.Date < today) {
			nextDate = getNextDayOfWeek();
			let newGame = {
				Date: nextDate
			};
			data.Games.unshift(newGame);
			fs.writeFileSync(memory, JSON.stringify(data, undefined, 4));
			return newGame;
		} else {
			return nextGame;
		}
	},
	async saveGame(newGame) {
		let data = await loadData();
		const lastGame = data.Games[0];
		
		if (lastGame == undefined || lastGame.Date < newGame.Date) {
			data.Games.unshift(newGame);
		} else {
			data.Games[0] = newGame;
		}
		fs.writeFileSync(memory, JSON.stringify(data, undefined, 4));
	},
	async setPlayerInfo(player, timezone) {
		let data = await loadData();
		
		data.PlayerTimeZones[player] = timezone;
		fs.writeFileSync(memory, JSON.stringify(data, undefined, 4));
	},
	async getPlayerInfo(player) {
		let data = await loadData();
		
		return data.PlayerTimeZones[player] || "-05:00";
	}
}

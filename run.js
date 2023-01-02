const { execSync } = require('child_process');

(async () => {
	await execSync('git pull')
	try {
		await execSync('git add menu-memory/*.json')
		await execSync('git commit -m "Save Memory"')
		await execSync('git push')
	} catch {
	}
	await execSync('npm ci')
	await require('./deploy-commands.js')
	await require('./index.js')
})();


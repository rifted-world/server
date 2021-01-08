
function check(){
	const fs = require('fs');
	let installers = fs.readFileSync('./modules/install/install.json');
	
	if(!installers.complete){
		const install_IPFS = require('./modules/install/install_ipfs_bin');
		install_IPFS.install();
	}

}
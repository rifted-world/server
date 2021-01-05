const https = require('https');
const fs = require('fs');
let ipfs_config = JSON.parse(fs.readFileSync('./modules/ipfs.json'));

// ++ Download, unzip and INIT IPFS binary from dist.ipfs.io

function install(){
	if (!fs.existsSync('tmp')){
    	fs.mkdirSync('tmp');
	}
	if (!fs.existsSync('bin')){
    	fs.mkdirSync('bin');
	}

	const decompress = require('decompress');

	//make "bin if nor exist" and download the binary file

	const file = fs.createWriteStream("./tmp/ipfs.zip");
	const request = https.get("https://dist.ipfs.io/go-ipfs/v0.7.0/go-ipfs_v0.7.0_windows-amd64.zip", function(response) {
		response.pipe(file);

		response.on('end', () => {
			console.log('There will be no more data. Strat decompressing');
			decompress('./tmp/ipfs.zip', './bin').then(files => {
				console.log('Extracted IPFS Bin');
				var child = require('child_process').execFile('./bin/go-ipfs/ipfs.exe', [ 'init' ]); 
				// use event hooks to provide a callback to execute when data are available: 
				child.stdout.on('data', function(data) {
					console.log(data.toString()); 
				});
				child.on('close', function(){
					console.log("IPFS INIT Ready");

					var get_versipn_cp = require('child_process').execFile('./bin/go-ipfs/ipfs.exe', [ 'version' ]); 
					get_versipn_cp.stdout.on('data', function(data) {
						let  version = data.toString().split(' ')
						console.log("Version is " + version[2]);
						ipfs_config.installed_version = version[2].replace(/\n|\r/g, "");
						ipfs_config.complete = true;

						let save_data = JSON.stringify(ipfs_config);
						fs.writeFileSync('./modules/ipfs.json', save_data);
						run_ipfs();
					});
					
				});
				child.on('error', function(e){
					console.log("Error in IPFS: "+e)
				});
			});
		});
	});
}


function check_version(){
	
	if(ipfs_config.complete && (ipfs_config.actual_version == ipfs_config.installed_version) ){
		run_ipfs();
	}else{
		install();
	}
}
function start(){
	check_version();
}
function run_ipfs(){
	console.log("Start IPFS Instance");
	var child = require('child_process').execFile('./bin/go-ipfs/ipfs.exe', [ 'daemon' ]); 
	child.stdout.on('data', function(data) {
		console.log(data.toString()); 
	});
	child.on('close', function(){
		console.log("IPFS Instance heruntergefahren");
	})
	child.on('error', function(e){
		console.log("IPFS Error " + e);
	})
}

module.exports = {
	install,
	start,

}
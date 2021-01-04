const https = require('https');
const fs = require('fs');


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
					console.log("IPFS INIT Ready")
				});
				child.on('error', function(e){
					console.log("Error in IPFS: "+e)
				});
			});
		});
	});

}


module.exports = {
	install,
}
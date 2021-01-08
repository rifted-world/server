const https = require('https');
const fs = require('fs');
const { CID } = require('ipfs-http-client')
const IpfsHttpClient = require('ipfs-http-client')
let ipfs_config = JSON.parse(fs.readFileSync('./modules/ipfs.json'));
process.platform === "win32";

let os = "";

let versions = {
	win: {
		dl_path: "https://dist.ipfs.io/go-ipfs/v0.7.0/go-ipfs_v0.7.0_windows-amd64.zip",
		arch_file: "ipfs.zip",
		exec_file: "ipfs.exe"
	},
	linux: {
		dl_path: "https://dist.ipfs.io/go-ipfs/v0.7.0/go-ipfs_v0.7.0_linux-amd64.tar.gz",
		arch_file: "ipfs.tar.gz",
		exec_file: "ipfs"
	},
}
switch (process.platform) {
	case "win32":
		os=versions[win]
		break;
	case "linux":
		os=versions[win]
		break;

	default:
		console.log("No OS found:" + process.platform)
		break;
}

let IPFS;
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

	const file = fs.createWriteStream("./tmp/"+os.arch_file);
	const request = https.get(os.dl_path, function(response) {
		response.pipe(file);

		response.on('end', () => {
			console.log('There will be no more data. Strat decompressing');
			decompress('./tmp/'+os.arch_file, './bin').then(files => {
				console.log('Extracted IPFS Bin');
				var child = require('child_process').execFile('./bin/go-ipfs/'+os.exec_file, [ 'init' ]); 
				// use event hooks to provide a callback to execute when data are available: 
				child.stdout.on('data', function(data) {
					console.log(data.toString()); 
				});
				child.on('close', function(){
					console.log("IPFS INIT Ready");

					var get_versipn_cp = require('child_process').execFile('./bin/go-ipfs/'+os.exec_file, [ 'version' ]); 
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
	var child = require('child_process').spawn('./bin/go-ipfs/ipfs.exe', [ 'daemon', '--enable-pubsub-experiment' ]); 
	child.stdout.on('data', function(data) {
		console.log(data.toString()); 
		if(data.toString().includes("Daemon is ready")){
			console.log(">>>>NEXT>>>>")
		}
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
	IPFS
}
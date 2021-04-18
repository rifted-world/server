const ipfsClient = require('ipfs-http-client')



	async function start(){
		ipfs = ipfsClient('http://localhost:5001');

		
		const topic = 'fruit-of-the-day'
		const receiveMsg = (msg) => test() 

		await ipfs.pubsub.subscribe(topic, receiveMsg)
		console.log(`subscribed to ${topic}`)
	}
		
		async function test(){
			if(once){
				const topic = 'fruit-of-the-day'
				const msg1 = Buffer.from("Test")
				await ipfs.pubsub.publish(topic, msg1)
				once = false;
			}
		}

	


module.exports = {
	start,
}
const ipfsClient = require('ipfs-http-client')



	async function start(){
		ipfs = ipfsClient('http://localhost:5001');


		const topic = 'fruit-of-the-day'
		const receiveMsg = (msg) => console.log(msg.toString())

		await ipfs.pubsub.subscribe(topic, receiveMsg)
			console.log(`subscribed to ${topic}`)
		}

	


module.exports = {
	start,
}
module.exports = function(io) {
	io.on('connection', (socket) => {
		console.log('user connected');

		//create message event
		socket.on('pmessage', (message) => {
			console.log(message);

			//sending messag eto everyone connected on this channel
			io.emit('newMessage', {
				text: message.text
			});
		});
	});
};

const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const Process = require('process');
const port = Process.env.PORT || 3000;

server.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});


app.get('/', (req, res) => {
	res.sendFile(__dirname + '/public/index.html');
});

app.get('/javascript', (req, res) => {
	res.sendFile(__dirname + '/public/javascript.html');
});

app.get('/swift', (req, res) => {
	res.sendFile(__dirname + '/public/swift.html');
});


app.get('/css', (req, res) => {
	res.sendFile(__dirname + '/public/css.html');
});

const tech = io.of('/tech');

tech.on('connection' ,(socket) => {
	// console.log('user connected');
	socket.on('join', (data => {
		socket.join(data.room);
		tech.in(data.room).emit('message', `${data.username} joined ${data.room} room!`);
	}))

	socket.on('message', (data) => {
		console.log(`${data.username}: ${data.msg}`);
		tech.in(data.room).emit('message', `${data.username}: ${data.msg}`);
	});
	socket.on('disconnect', () => {
		console.log('user disconnected');

		tech.emit('message', 'user disconnected');
	})
})

var express = require('express');
var app = express();
var server = require ('http').createServer(app);


const io = require ('socket.io')(server);
users = [];
connections = [];

server.listen(process.env.PORT || 3000);
console.log("Server running...")
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');

});




app.use(express.static('public'));
// app.use(express.static(__dirname + '/public'));


io.sockets.on('connection', function(socket) {
    connections.push(socket);
    console.log('Connected: % sockets connected', connections.length);

//Connexion

//Disconnected
    socket.on('disconnect', function(data){
        users.splice(users.indexOf(socket.username), 1);
        updateUsernames();
        connections.splice(connections.indexOf(socket), 1);
        console.log("Disconnected: % sockets connected", connections.length);
    });

    // Send messages

    socket.on('send message', function(data){
        console.log(data);
        io.sockets.emit('new message', {msg: data, user: socket.username});
    });


   
    
    //// New user
    socket.on('new user', function(data, callback){
        console.log(data)
        //if (callback) callback();
        socket.username = data;
        
        users.push(socket.username);
        updateUsernames();
        callback(1);
    });

    function updateUsernames(){
        console.log(users)
        io.sockets.emit('get users', users)
    }


});

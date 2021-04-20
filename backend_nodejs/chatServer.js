var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var _ =  require('lodash')
var cors = require('cors');
app.use(cors())



var http = require('http').createServer(app);
const PORT = 8080;


var STATIC_CHANNELS = 
[{
    name: 'Global Room',
    participants: 0,
    id: 1,
    sockets: [],
    users:[],
}, {
    name: 'Editor Room',
    participants: 0,
    id: 2,
    sockets: [],
    users:[],
}, {
    name: 'General Room',
    participants: 0,
    id: 3,
    sockets: [],
    users:[],
}];

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
})


http.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});
var io = require('socket.io')(http, {
    cors: {
      origin: '*',
    }
  });

io.on('connection', (socket) => {
    console.log('new client connected');
    socket.emit('connection', null);
    socket.on('channel-join', (obj) => {
        console.log('channel join',obj);
        let id= obj.id
        let name=obj.user
        console.log(obj,id,name)
        STATIC_CHANNELS.forEach(c => {
            if (c.id === id) {
                if (c.sockets.indexOf(socket.id) == (-1)) {
                    c.sockets.push(socket.id);
                    c.users.push({
                        "id":socket.id,
                        "name":name || 'Unknown user'
                    })
                    console.log("-------------",c)
                    c.participants++;
                    io.emit('channel', c);
                }
            } else {
                let index = c.sockets.indexOf(socket.id);
                console.log(socket.id,c.users)
                let userInd= _.find(c.users, { 'id': socket.id});
                console.log(userInd,c)
                if (index != (-1)) {
                    c.sockets.splice(index, 1);
                    c.users.splice(userInd, 1);
                    c.participants--;
                    io.emit('channel', c);
                }
            }
        });

        return socket.id;
    });
    socket.on('send-message', message => {
        io.emit('message', message);
    });

    socket.on('disconnect', () => {
        STATIC_CHANNELS.forEach(c => {
            let index = c.sockets.indexOf(socket.id);
            let userInd= _.find(c.users, { 'id': socket.id});
            if (index != (-1)) {
                c.sockets.splice(index, 1);
                c.users.splice(userInd, 1);
                console.log("**************",c)
                c.participants--;
                io.emit('channel', c);
            }
        });
    });

});



/**
 * @description This methos retirves the static channels
 */
app.get('/getChannels', (req, res) => {
    res.json({
        channels: STATIC_CHANNELS
    })
});
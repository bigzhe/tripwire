import path from 'path';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import config from './webpack.config.babel';
import express from 'express';

import { TARGET_URL } from './server/config.js'
import AttackPattern from './server/attackPattern.js'
import { zipMODEL, unzipMODEL, modelReducer, parseLog } from './server/util.js'

var socket_io = require('socket.io');
var storage = require('node-persist');

//you must first call storage.initSync
storage.initSync({
    dir: 'server/persist'
});


var bodyParser = require('body-parser')



const app = new express();
const port = 3000;

var server = require('http').Server(app);
server.listen(3000, error => {
  console.log('listening on port 3000')
});

var io = socket_io();
io.attach(server);
io.on('connection', function(socket){
  console.log("Socket connected: " + socket.id);
  socket.on('action', (action) => {
    if(action.type === 'server/hello'){
      console.log('Got hello data!', action.data);
      // socket.emit('action', {type:'message', data:'good day!'});
      io.emit('action', {type:'message', data:'good day!'});
    }

    if (action.type === 'server/disconnect') {
        console.log('someone want to disconnet')
        socket.disconnect()
    }
  });

  socket.on('disconnect', function () {
      console.log('user disconnected');
  });
  
});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// app.use(express.static('public'))

const compiler = webpack(config);
app.use(webpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath,
}));

let MODEL = storage.getItemSync('MODEL')
// transfer the model to the form
MODEL = unzipMODEL(MODEL)
console.log('-------unzipped MODEL---------------');
console.log(MODEL);
console.log('------------------------------------');

// router
var router = express.Router();

const tripwireParse = (log) => {
    if (log.content.startsWith('/')) {
        log.activity = 'file'
    } else if (log.content.includes('@')) {
        log.activity = 'email'
    } else if (log.content.startsWith('http')) {
        log.activity = 'http'
    } else if (log.content === 'login' || log.content === 'logoff') {
        log.activity = log.content
    } else if (log.content === 'usb removed') {
        log.activity = 'remove'
    } else if (log.content === 'usb inserted') {
        log.activity = 'insert'
    }

    switch (log.activity) {
        case 'file':
            return {
                user: log.user,
                device: log.device,
                activity: log.activity,
                key_data: {
                    Date: log.date,
                    Path: log.content,
                }
            }
        case 'login':
            return {
                user: log.user,
                device: log.device,
                activity: log.activity,
                key_data: {
                    Date: log.date,
                }
            }
        case 'logoff':
            return {
                user: log.user,
                device: log.device,
                activity: log.activity,
                key_data: {
                    Date: log.date,
                }
            }
        case 'email':
            return {
                user: log.user,
                device: log.device,
                activity: log.activity,
                key_data: {
                    Date: log.date,
                    Email: log.content
                }
            }
        case 'http':
            return {
                user: log.user,
                device: log.device,
                activity: log.activity,
                key_data: {
                    Date: log.date,
                    Address: log.content
                }
            }
        case 'insert':
            return {
                user: log.user,
                device: log.device,
                activity: log.activity,
                key_data: {
                    Date: log.date,
                }
            }
        case 'remove':
            return {
                user: log.user,
                device: log.device,
                activity: log.activity,
                key_data: {
                    Date: log.date,
                }
            }
    
        default:
            break;
    }
}

router.route('/logs')
    .post((req, res) => {

        // TODO: parse the log and maybe store the tripwire rather than store the log
        // this is the place for the real world cases


        const tuple = tripwireParse(req.body)
        console.log(tuple)

        // update the model using the log
        let {moves, expired} = parseLog(MODEL, tuple)

        console.log('------MOVES-------------------------');
        console.log(moves);
        console.log('------------------------------------');
        
        io.emit('action', {
            type: 'ADD_LOG',
            id: tuple.user,
            text: 'Moves: ' + moves.map(move => move.from + ' -> ' + move.to).join(', ')
        })
        MODEL = modelReducer(MODEL, {
            type: 'USER_MOVE_TO_MULTIPLE',
            tuple,
            moves,
            expired
        })

        // store the new model
        storage.setItemSync('MODEL', zipMODEL(MODEL))

        // TODO: notify clients
        io.emit('action', {
            type: 'USER_MOVE_TO_MULTIPLE',
            tuple,
            moves
        })


        // res.json(MODEL)
        res.send('Parsed')
    })

router.route('/model')
    .get((req, res) => {
        // MODEL = storage.getItemSync('MODEL')
        res.json({
            model: MODEL,
            attackPattern: AttackPattern
        })
    })
    .delete((req, res) => {
        storage.removeItemSync('MODEL')
        MODEL = unzipMODEL(undefined)
        io.emit('action', {type: 'RESET_MODEL'})
        io.emit('action', {
            type: 'SET_SNACKBAR_MESSAGE',
            message: 'Model has been reset'
        })
        res.send('Done')
    })

app.use('/api', router);

app.get('/*', (req, res) => {
console.log('sent root')
io.emit('action', {type: 'message', data: 'someone linked to the server'})
res.sendFile(path.join(__dirname, 'index.html'));
});



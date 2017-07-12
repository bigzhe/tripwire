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

router.route('/logs')
    .post((req, res) => {
        let log = {}
        
        log.id = req.body.id
        log.pc = req.body.pc
        log.action = req.body.action
        log.date = new Date(req.body.date) // parse the date string to Date object
    

        // TODO: parse the log and maybe store the tripwire rather than store the log
        // this is the place for the real world cases
        log.action = log.action.split(' ')

        // update the model using the log
        let moves = parseLog(MODEL, log)

        console.log('------MOVES-------------------------');
        console.log(moves);
        console.log('------------------------------------');
       
        MODEL = modelReducer(MODEL, {
            type: 'USER_MOVE_TO_MULTIPLE',
            id: log.id,
            moves
        })

        // store the new model
        storage.setItemSync('MODEL', zipMODEL(MODEL))

        // TODO: notify clients
        io.emit('action', {
            type: 'USER_MOVE_TO_MULTIPLE',
            id: log.id,
            moves
        })

        res.json(MODEL)
        // res.json({ log: 'Log processed'})
    })

router.route('/model')
    .get((req, res) => {
        res.json({
            model: MODEL,
            attackPattern: AttackPattern
        })
    })
    .delete((req, res) => {
        storage.removeItemSync('MODEL')
        MODEL = unzipMODEL(undefined)
        res.send('Done')
    })

app.use('/api', router);

app.get('/*', (req, res) => {
console.log('sent root')
io.emit('action', {type: 'message', data: 'someone linked to the server'})
res.sendFile(path.join(__dirname, 'index.html'));
});



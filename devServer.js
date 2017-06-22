import path from 'path';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import config from './webpack.config.babel';
import express from 'express';

import { TARGET_URL } from './server/config.js'



var mongoose   = require('mongoose');
var socket_io = require('socket.io');

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


// database
mongoose.connect('mongodb://admin:123456@ds129352.mlab.com:29352/message'); // connect to our database

var Message = require('./models/message');
const Log = require('./models/log')

// router
var router = express.Router();

router.route('/logs')
    .post((req, res) => {
        const log = new Log()
        
        log.id = req.body.id
        log.pc = req.body.pc
        log.action = req.body.action
        log.date = new Date(req.body.date) // parse the date string to Date object

        console.log(req.body)
        console.log(log)

        

        // TODO: parse the log and maybe store the tripwire rather than store the log

        // TODO: update the model using the log

        // log.save((err, m) => {
            // if (err)
                // res.send(err)
            // res.json({ log: 'Log saved'})
            
        // })
        res.json({ log: 'Log saved'})
    }).get((req, res) => {
        Log.find(function(err, logs) {
            if (err)
                res.send(err);
            // console.log('send back' + messages)
            res.json(logs);
        });
    })

router.route('/messages')
    .post(function(req, res) {

        var message = new Message();
        message.text = req.body.text;  // set the bears name (comes from the request)
        message.value = req.body.value;  // set the bears name (comes from the request)

        // save the bear and check for errors
        message.save(function(err, m) {
            if (err)
                res.send(err);
            res.json({ message: 'Message created!' });
            io.emit('action', {type: 'ADD_MESSAGE', data: {_id: m.id, text: message.text}})
        });

    })
    .get(function(req, res) {
        Message.find(function(err, messages) {
            if (err)
                res.send(err);
            // console.log('send back' + messages)
            res.json(messages);
        });
    })
    .delete(function(req, res) {
        Message.remove({}, function(err, message) {
            if (err)
                res.send(err)
            io.emit('action', {type: 'DELETE_ALL_MESSAGES'})
            
        })
    })
router.route('/messages/:message_id')
    .get(function(req, res) {
        Message.findById(req.params.message_id, function(err, message) {
            if (err)
                res.send(err);
            res.json(message);

            res.json({ message: 'Successfully get' });
            
        });
    })
    .put(function(req, res) {

        // use our bear model to find the bear we want
        Message.findById(req.params.message_id, function(err, message) {

            if (err)
                res.send(err);

            console.log(req.body)
            message.text = req.body.text;  // update the bears info

            // save the bear
            message.save(function(err, m) {
                if (err)
                    res.send(err);

                res.json({ message: 'message updated!' });
                io.emit('action', {type: 'UPDATE_MESSAGE', data: {_id: m.id, text: message.text}})
            });

        });
    })
    .delete(function(req, res) {
        Message.remove({
            _id: req.params.message_id
        }, function(err, message) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
            io.emit('action', {type: 'DELETE_MESSAGE', _id: req.params.message_id})
        });
    });



app.use('/api', router);

app.get('/*', (req, res) => {
  console.log('sent root')
  io.emit('action', {type: 'message', data: 'someone linked to the server'})
  res.sendFile(path.join(__dirname, 'index.html'));
});




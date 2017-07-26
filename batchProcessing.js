var csv = require("fast-csv");

import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';

import AttackPattern from './attackPattern.js'
import { zipMODEL, unzipMODEL, modelReducer, parseLog } from './util.js'

var storage = require('node-persist');

//you must first call storage.initSync
storage.initSync({
    dir: 'server/persist'
});

let MODEL = storage.getItemSync('MODEL')
// transfer the model to the form
MODEL = unzipMODEL(MODEL)

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

let i = 0
csv
  .fromPath("test_cases/data.csv")
  .on("data", function (t) {
    // tuples.push(tuple)
    const data = {
      user: t[0],
      date: t[1],
      device: t[2],
      content: t[3]
    }

    const tuple = tripwireParse(data)
    // console.log(tuple)
    // console.log(i++)

    // update the model using the log
    let {moves, expired} = parseLog(MODEL, tuple)
    MODEL = modelReducer(MODEL, {
        type: 'USER_MOVE_TO_MULTIPLE',
        tuple,
        moves,
        expired
    })

  })
  .on("end", function () {
    storage.setItemSync('MODEL', zipMODEL(MODEL))
    console.log('Done')
    console.log('------------------------------------');
    console.log(MODEL);
    console.log('------------------------------------');
  });
